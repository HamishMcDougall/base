<template>
    <div>


            <form action="/api/payment/" method="POST">
  <script
    src="https://checkout.stripe.com/checkout.js" class="stripe-button"
    data-key="pk_test_NVw9CdwviRFSyytLzuitGNvw"
    data-amount="999"
    data-name="Cheapbakingmats"
    data-description="Widget"
    data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
    data-locale="auto"
    data-zip-code="false"
    data-currency="aud">
  </script>
</form>



    </div>
</template>

<script>





 export default {
data: function () {
    return {
      count: 0
    }
},  methods: {
    greet: function (event) {
      
    }
 }
 }
</script>