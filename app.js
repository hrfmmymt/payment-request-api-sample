function initPaymentRequest() {
  let networks = [
    'amex',
    'diners',
    'jcb',
    'mastercard',
    'visa'
  ];

  let types = [
    'debit',
    'credit',
    'prepaid'
  ];

  let supportedInstruments = [{
    supportedMethods: networks,
  }, {
    supportedMethods: ['basic-card'],
    data: {
      supportedNetworks: networks,
      supportedTypes: types
    },
  }];

  let details = {
    displayItems: [{
      label: 'Price',
      amount: {
        currency: 'JPY',
        value: '100'
      },
    }, {
      label: 'Discount',
      amount: {
        currency: 'JPY',
        value: '-10'
      },
    }],
    total: {
      label: 'Total',
      amount: {
        currency: 'JPY',
        value: '90'
      }
    },
  };
  return new PaymentRequest(supportedInstruments, details);
}

function onBuyClicked(request) {
  request.show().then(instrumentResponse => {
    sendPaymentToServer(instrumentResponse);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function sendPaymentToServer(instrumentResponse) {
  window.setTimeout(() => {
    instrumentResponse.complete('success')
    .then(() => {
      document.getElementById('result').innerHTML = instrumentToJsonString(instrumentResponse);
    })
    .catch(err => {
      console.log(err);
    });
  }, 2000);
}

function instrumentToJsonString(instrument) {
  let details = instrument.details;
  details.cardNumber = 'XXXX-XXXX-XXXX-' + details.cardNumber.substr(12);
  details.cardSecurityCode = '***';

  return JSON.stringify({
    methodName: instrument.methodName,
    details: details,
  }, undefined, 2);
}

const payButton = document.getElementById('buyButton');
let request = initPaymentRequest();
payButton.addEventListener('click', () => {
  onBuyClicked(request);
  request = initPaymentRequest();
});
