<template>
  <div class="header-dashboard">
    <div style="display: flex; align-items: center">
      <img
        src="../../assets/img/logo-white.png"
        style="width: 160px"
        alt="logo-mini"
      />
    </div>

    <div>
      <CustomMenu width="250px">
        <template #trigger>
          <div class="avatar">{{ initials }}</div>
        </template>

        <template #content>
          <Button icon="logout" @click="logoutSession" :full-width="true"
            >Cerrar Sesión</Button
          >
        </template>
      </CustomMenu>
    </div>
  </div>

  <Modal
    :visible="modalProfile"
    icon="account_circle"
    width="800px"
    title="Editar perfil"
    @update:visible="closeModal"
  >
    <Profile />
  </Modal>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue';
  import { logout } from '../../auth/auth-service';
  import { useRouter, useRoute } from 'vue-router';
  import { TokenService } from '../../auth/auth-jwt-service';

  import Profile from './Profile/Profile.vue';

  import CustomMenu from '../../shared/CustomMenu/CustomMenu.vue';
  import Modal from '../../shared/Modal/Modal.vue';
  import Button from '../../shared/Button/Button.vue';

  export default defineComponent({
    name: 'Header',
    components: { Profile, CustomMenu, Button, Modal },
    setup() {
      const router = useRouter();
      const route = useRoute();

      const modalProfile = ref<boolean>(false);
      const isFexcomCrm = ref(false);

      const fullname = ref<string>(TokenService.getClaim('fullName'));

      const initials = computed(() => {
        if (!fullname.value) return '';

        const words = fullname.value.split(' ').slice(0, 2);
        const firstLetters = words.map((word) => word.charAt(0).toUpperCase());
        return firstLetters.join('');
      });

      const logoutSession = () => {
        logout(() => router.push({ name: 'auth' }));
      };

      const openModalEditProfile = () => {
        modalProfile.value = true;
      };

      const closeModal = () => {
        modalProfile.value = false;
      };

      const updateLogo = () => {
        isFexcomCrm.value = route.path.includes('fexcom-crm');
      };

      updateLogo();

      watch(
        () => route.path,
        () => {
          updateLogo();
        }
      );

      return {
        modalProfile,
        logoutSession,
        openModalEditProfile,
        closeModal,
        isFexcomCrm,
        fullname,
        initials
      };
    },
  });
</script>

<style scoped>
  @import url(./header-styles.css);
</style>
