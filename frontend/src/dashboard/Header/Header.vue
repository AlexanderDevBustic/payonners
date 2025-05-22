<template>
  <div class="header-dashboard">
    <div style="display: flex; align-items: center">
      <img
        src="../../assets/img/logo.png"
        style="width: 160px; filter: brightness(0) invert(1);"
        alt="logo-mini"
      />
    </div>

    <div>
      <CustomMenu width="250px">
        <template #trigger>
          <div class="avatar">
            <span v-if="!avatarBase64">{{ initials }}</span>
            <img v-if="avatarBase64" :src="avatarBase64" alt="avatar">
          </div>
        </template>

        <template #content>

          <h1 style="text-align: center; font-size: 15px; margin-bottom: 20px;">{{ fullname }}</h1>

          <Button @click="openModalEditProfile" icon="person" :full-width="true">Perfil</Button>

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
      const showProfile = ref(false);

      const fullname = ref<string>(TokenService.getClaim('fullName'));

       const avatarBase64 = ref<string | undefined>(localStorage.getItem('AVATAR_USER') || undefined);

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
        initials,
        showProfile,
        avatarBase64
      };
    },
  });
</script>

<style scoped>
  @import url(./header-styles.css);
</style>
