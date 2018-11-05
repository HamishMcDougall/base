<template>
<div>
    <login />


  <div>

    stripe intergration
    <stripecomponent/>

  </div>
</div>
</template>

<script>

  import login from '~/components/login.vue';
 import stripecomponent from '~/components/stripe-component.vue';

  
  export default {



    components: {
      login,
      stripecomponent

    }
  }

</script>
