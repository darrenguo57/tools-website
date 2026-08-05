# ============================================================
# GitHub 敏感文件清理脚本
# 用途：从 Git 历史记录中彻底删除不适合公开的文件
# 警告：此操作会重写 Git 历史，执行前请确保已备份
# ============================================================

param(
    [switch]$DryRun,
    [switch]$Force
)

# 需要删除的文件/目录列表（相对于仓库根目录）
$filesToRemove = @(
    "ads_code.txt",
    "x-promotion-plan.html",
    "docs/test-report",
    "docs/test-cases.md",
    "docs/test-plan.md",
    "docs/test-report.md",
    "playwright-helper.js",
    "playwright-test-1.60.0.tgz",
    "playwright.config.js",
    ".firebaserc",
    "firebase.json"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub 敏感文件清理工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否在 Git 仓库中
$gitDir = git rev-parse --git-dir 2>$null
if (-not $gitDir) {
    Write-Host "错误：当前目录不是 Git 仓库" -ForegroundColor Red
    Write-Host "请在 tools-website 项目的 Git 仓库根目录下运行此脚本" -ForegroundColor Yellow
    exit 1
}

Write-Host "检测到 Git 仓库: $gitDir" -ForegroundColor Green
Write-Host ""

# 显示将要删除的文件
Write-Host "将要清理以下文件/目录：" -ForegroundColor Yellow
foreach ($file in $filesToRemove) {
    Write-Host "  - $file" -ForegroundColor White
}
Write-Host ""

if ($DryRun) {
    Write-Host "【演练模式】不会实际执行删除操作" -ForegroundColor Magenta
    Write-Host "使用 -Force 参数确认执行" -ForegroundColor Magenta
    exit 0
}

if (-not $Force) {
    Write-Host "警告：此操作将永久重写 Git 历史记录！" -ForegroundColor Red
    Write-Host "执行后需要使用 git push --force 更新远程仓库" -ForegroundColor Red
    Write-Host ""
    Write-Host "请使用以下命令确认执行：" -ForegroundColor Yellow
    Write-Host "  .\clean-sensitive-files.ps1 -Force" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "建议先备份仓库：" -ForegroundColor Yellow
    Write-Host "  git clone --mirror <你的仓库地址> backup.git" -ForegroundColor Cyan
    exit 0
}

Write-Host "开始清理..." -ForegroundColor Green
Write-Host ""

# 方法1：使用 git filter-branch（兼容性最好）
Write-Host "步骤 1/3: 使用 git filter-branch 删除文件..." -ForegroundColor Cyan

$filterCommand = "git filter-branch --force --index-filter `"git rm --cached --ignore-unmatch"
foreach ($file in $filesToRemove) {
    $filterCommand += " $file"
}
$filterCommand += "`" --prune-empty --tag-name-filter cat -- --all"

Write-Host "执行命令: $filterCommand" -ForegroundColor DarkGray
Invoke-Expression $filterCommand

if ($LASTEXITCODE -ne 0) {
    Write-Host "git filter-branch 执行失败，尝试备用方法..." -ForegroundColor Yellow
    
    # 备用方法：使用 git-filter-repo（如果已安装）
    $filterRepo = Get-Command git-filter-repo -ErrorAction SilentlyContinue
    if ($filterRepo) {
        Write-Host "使用 git-filter-repo 重新尝试..." -ForegroundColor Cyan
        $pathsArg = ($filesToRemove | ForEach-Object { "--path $_" }) -join " "
        Invoke-Expression "git filter-repo --force --invert-paths $pathsArg"
    } else {
        Write-Host "错误：清理失败。建议手动安装 git-filter-repo:" -ForegroundColor Red
        Write-Host "  pip install git-filter-repo" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "步骤 2/3: 清理 Git 引用日志和临时文件..." -ForegroundColor Cyan

# 删除备份的 refs
if (Test-Path ".git/refs/original") {
    Remove-Item -Recurse -Force ".git/refs/original"
}

# 强制垃圾回收
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host ""
Write-Host "步骤 3/3: 验证清理结果..." -ForegroundColor Cyan

# 检查文件是否仍在历史中
$stillExists = $false
foreach ($file in $filesToRemove) {
    $result = git log --all --full-history -- "$file" 2>$null
    if ($result) {
        Write-Host "  警告: $file 仍在历史中" -ForegroundColor Red
        $stillExists = $true
    } else {
        Write-Host "  已清理: $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($stillExists) {
    Write-Host "部分文件可能未完全清理，请检查上方警告" -ForegroundColor Yellow
} else {
    Write-Host "所有指定文件已从 Git 历史中删除" -ForegroundColor Green
}

Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Yellow
Write-Host "1. 确认本地文件仍然存在（仅删除历史记录）" -ForegroundColor White
Write-Host "2. 强制推送到 GitHub:" -ForegroundColor White
Write-Host "   git push origin --force --all" -ForegroundColor Cyan
Write-Host "   git push origin --force --tags" -ForegroundColor Cyan
Write-Host ""
Write-Host "注意：强制推送会影响其他协作者，请确保通知团队成员" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
