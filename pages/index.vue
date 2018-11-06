<template>
<div>
    <login />


  <div>

    stripe intergration
    <stripecomponent/>
    <br>
    <br>
    <div v-on:click="fetchSomething">Get customer list</div>
    <div class="d-inline-flex d-flex justify-content-start" v-for="customer in customers">
      <div>Customer Id: {{customer.id}}</div>
      <div>Paid: {{customer.paid}}</div>
      <div>Type:{{customer.statement_descriptor}}</div>
    </div>
<br>
 <br>

<input v-model="surebet.raceNumber" placeholder="race number">
<p>RaceNumber: {{ surebet.raceNumber }}</p>

<input v-model="surebet.hourseNumber" placeholder="Horse Number">
<p>RaceNumber: {{ surebet.hourseNumber }}</p>

<textarea v-model="surebet.comment" placeholder="Comment"></textarea>
<p>Comment: {{ surebet.comment }}</p>

    <div v-on:click="sendEmail">Send Email</div>



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
    },
     data: function () {
    return {
      customers: [],
      surebet: {
        raceNumber:'',
        hourseNumber:'',
        comment:''
      }
      
    }
  },
        methods: {
           async fetchSomething() {
            const customers = await this.$axios.$post('/api/customer')
            this.customers = customers.data
          },
          sendEmail(){
          
             const sendEmails = this.$axios.$post('/api/sendemails',this.surebet)
          }

        }
  }

</script>
