/**
 * paypal.js - PayPal 收款组件
 * 
 * 使用方法：
 * 1. 注册 PayPal Business 账户
 * 2. 获取你的 PayPal Client ID
 * 3. 替换下面的 PAYPAL_CLIENT_ID
 * 4. 在需要显示按钮的位置添加：<div id="paypal-button-container"></div>
 */

const PayPal = (() => {
  'use strict';

  // PayPal Client ID
  const PAYPAL_CLIENT_ID = 'AV1ibSI5cMM1DDR7SxiahHlHxkf6JC3XAYExWEyINq9KHVQbwB5wYWQPZ6cEbdWpuV8D1ZGSMwD4irN8';
  
  // 测试环境（沙盒）- 完成后改为生产环境
  const PAYPAL_ENV = 'sandbox'; // 'sandbox' 或 'live'
  
  // 默认金额选项
  const AMOUNTS = [
    { id: 'coffee', label: 'Coffee ☕', value: 5 },
    { id: 'lunch', label: 'Lunch 🍱', value: 15 },
    { id: 'support', label: 'Support 💪', value: 30 },
    { id: 'sponsor', label: 'Sponsor 🌟', value: 50 }
  ];

  let paypalScriptLoaded = false;
  let callbacks = {
    onSuccess: null,
    onError: null,
    onCancel: null
  };

  /**
   * 加载 PayPal SDK
   */
  function loadPayPalScript() {
    return new Promise((resolve, reject) => {
      if (paypalScriptLoaded) {
        resolve();
        return;
      }

      // 检查是否已存在
      if (document.querySelector('script[src*="paypal.com/sdk"]')) {
        paypalScriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
      script.async = true;
      
      script.onload = () => {
        paypalScriptLoaded = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load PayPal SDK'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * 创建捐赠按钮
   */
  async function createDonationButton(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`PayPal: Container #${containerId} not found`);
      return;
    }

    const {
      presetAmount = null,
      customAmount = true,
      description = 'Support UseEasyTool Development',
      onSuccess,
      onError,
      onCancel
    } = options;

    if (onSuccess) callbacks.onSuccess = onSuccess;
    if (onError) callbacks.onError = onError;
    if (onCancel) callbacks.onCancel = onCancel;

    try {
      await loadPayPalScript();

      // 清空容器
      container.innerHTML = '';

      // 创建按钮容器
      const buttonContainer = document.createElement('div');
      buttonContainer.id = 'paypal-buttons';
      container.appendChild(buttonContainer);

      // PayPal 按钮配置
      const buttonConfig = {
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        },
        createOrder: (data, actions) => {
          const amount = presetAmount || 15; // 默认金额
          return actions.order.create({
            purchase_units: [{
              description: description,
              amount: {
                value: amount.toFixed(2)
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            if (callbacks.onSuccess) {
              callbacks.onSuccess({
                orderID: data.orderID,
                details: details
              });
            }
            showSuccessMessage(container, details);
          });
        },
        onError: (err) => {
          if (callbacks.onError) {
            callbacks.onError(err);
          }
          console.error('PayPal Error:', err);
        },
        onCancel: (data) => {
          if (callbacks.onCancel) {
            callbacks.onCancel(data);
          }
          showCancelMessage(container);
        }
      };

      // 渲染按钮
      paypal.Buttons(buttonConfig).render('#paypal-buttons');

    } catch (error) {
      console.error('PayPal initialization error:', error);
      showErrorMessage(container, error.message);
    }
  }

  /**
   * 创建订阅按钮
   */
  async function createSubscriptionButton(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`PayPal: Container #${containerId} not found`);
      return;
    }

    const {
      planId = 'YOUR-PLAN-ID', // 需要在 PayPal 创建订阅计划
      onSuccess,
      onError,
      onCancel
    } = options;

    if (onSuccess) callbacks.onSuccess = onSuccess;
    if (onError) callbacks.onError = onError;
    if (onCancel) callbacks.onCancel = onCancel;

    try {
      await loadPayPalScript();

      container.innerHTML = '';

      const buttonConfig = {
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'subscribe'
        },
        createSubscription: (data, actions) => {
          return actions.subscription.create({
            plan_id: planId
          });
        },
        onApprove: (data, actions) => {
          if (callbacks.onSuccess) {
            callbacks.onSuccess({
              subscriptionID: data.subscriptionID
            });
          }
          showSuccessMessage(container, { subscriptionID: data.subscriptionID });
        },
        onError: (err) => {
          if (callbacks.onError) {
            callbacks.onError(err);
          }
        },
        onCancel: (data) => {
          if (callbacks.onCancel) {
            callbacks.onCancel(data);
          }
        }
      };

      paypal.Buttons(buttonConfig).render(`#${containerId}`);

    } catch (error) {
      console.error('PayPal subscription error:', error);
    }
  }

  /**
   * 创建自定义金额按钮
   */
  async function createCustomAmountButton(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const {
      presetAmounts = AMOUNTS,
      onSuccess,
      onError,
      onCancel
    } = options;

    // 创建预设金额选择器
    let selectedAmount = presetAmounts[1].value; // 默认选择 lunch

    const html = `
      <div class="paypal-custom-container">
        <div class="paypal-amount-options">
          ${presetAmounts.map((amount, index) => `
            <label class="paypal-amount-option">
              <input type="radio" name="paypal-amount" value="${amount.value}" ${index === 1 ? 'checked' : ''}>
              <span class="amount-label">$${amount.value}</span>
              <span class="amount-tag">${amount.label}</span>
            </label>
          `).join('')}
        </div>
        <div class="paypal-custom-input">
          <label>
            <span>Custom Amount ($)</span>
            <input type="number" id="custom-paypal-amount" min="1" max="1000" value="${selectedAmount}">
          </label>
        </div>
        <div id="paypal-buttons-container"></div>
      </div>
    `;

    container.innerHTML = html;

    // 绑定金额选择事件
    container.querySelectorAll('input[name="paypal-amount"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        selectedAmount = parseFloat(e.target.value);
        container.querySelector('#custom-paypal-amount').value = selectedAmount;
      });
    });

    container.querySelector('#custom-paypal-amount').addEventListener('input', (e) => {
      selectedAmount = parseFloat(e.target.value) || 0;
      container.querySelectorAll('input[name="paypal-amount"]').forEach(radio => {
        radio.checked = parseFloat(radio.value) === selectedAmount;
      });
    });

    // 创建 PayPal 按钮
    await loadPayPalScript();

    const buttonConfig = {
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal'
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            description: 'Support UseEasyTool Development',
            amount: {
              value: selectedAmount.toFixed(2)
            }
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then((details) => {
          if (onSuccess) onSuccess({ orderID: data.orderID, details });
          showSuccessMessage(container, details);
        });
      },
      onError: (err) => {
        if (onError) onError(err);
      },
      onCancel: (data) => {
        if (onCancel) onCancel(data);
      }
    };

    paypal.Buttons(buttonConfig).render('#paypal-buttons-container');
  }

  /**
   * 显示成功消息
   */
  function showSuccessMessage(container, details) {
    container.innerHTML = `
      <div class="paypal-success">
        <div class="success-icon">✓</div>
        <h3 data-i18n="paypal_success_title">Thank You!</h3>
        <p data-i18n="paypal_success_text">Your support helps us keep the tools free.</p>
        ${details.payer ? `<p class="payer-name">${details.payer.name.given_name}</p>` : ''}
      </div>
    `;
    
    // 触发语言更新
    if (typeof I18n !== 'undefined' && I18n.translatePage) {
      I18n.translatePage();
    }
  }

  /**
   * 显示取消消息
   */
  function showCancelMessage(container) {
    container.innerHTML = `
      <div class="paypal-cancel">
        <p data-i18n="paypal_cancel_text">Payment was cancelled. You can try again anytime.</p>
      </div>
    `;
  }

  /**
   * 显示错误消息
   */
  function showErrorMessage(container, message) {
    container.innerHTML = `
      <div class="paypal-error">
        <p>Unable to load PayPal. Please try again later.</p>
      </div>
    `;
  }

  return {
    init: loadPayPalScript,
    createDonationButton,
    createSubscriptionButton,
    createCustomAmountButton,
    AMOUNTS
  };
})();
