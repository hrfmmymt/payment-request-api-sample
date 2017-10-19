function pay(details) {
  const methodData = [{
    supportedMethods: ['basic-card'],
    data: {
      supportedNetworks: [
        'visa',
        'mastercard',
        'amex',
        'diners',
        'jcb'
      ]
    }
  }];

  const options = {};

  const request = new PaymentRequest(methodData, details, options);

  request.show().then(result => {
    return Promise.race([
      fetch('/pay', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(result.toJSON())
      })
    ])
    .then(response => {
      if (response.status === 200) {
        return result.complete('success');
      } else {
        return result.complete('fail');
      }
    })
    .catch(() => result.complete('fail'));
  });
}

function onBuyClicked(event) {
  pay({
    displayItems: [{
      label: event.target.parentNode.dataset.label,
      amount: {
        currency: 'JPY',
        value: event.target.parentNode.dataset.value
      }
    }, {
      label: 'Friends and family discount',
      amount: {
        currency: 'JPY',
        value : '-10'
      },
      pending: true
    }],
    total: {
      label: 'Total',
      amount: {
        currency: 'JPY',
        value: Number(event.target.parentNode.dataset.value) - 10
      }
    }
  });
}

document.querySelectorAll('button[type="button"]').forEach(button => {
  button.addEventListener('click', onBuyClicked);
});
