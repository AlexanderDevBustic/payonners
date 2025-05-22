import Swal from 'sweetalert2';

export const useSweetAlert = () => {
    
  const showModal = async (
    title: string,
    content: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info',
    showCancelButton: boolean = true
  ) => {
    return await Swal.fire({
      title,
      html: content,
      icon,
      showCancelButton,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      width: '600px',
      allowOutsideClick: false,
    });
  };

  const showConfirmation = async (title: string, text: string) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    return result.isConfirmed;
  };

  const showSuccess = (message: string) => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
    });
  };

  const showError = (message: string) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  };

  return {
    showModal,
    showConfirmation,
    showSuccess,
    showError,
  };
};