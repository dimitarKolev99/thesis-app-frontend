import { defineStore } from "pinia";
import EnvironmentHandler from '@/EnvironmentHandler';

export const useLoginStore = defineStore('loginStore', {
    state: () => ({
      user: {
        email: ''
      }
    }),

    getters: {
      getEmail(): string {
        return this.user.email;
      }
    },

    actions: {

    setEmail(newEmail: string): void {
      this.user.email = newEmail;
    },


    
  
    }

});