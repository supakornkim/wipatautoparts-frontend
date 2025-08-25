// src/services/forms/sign-up.ts
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAsyncAction } from '~/store/hooks';
import { useUserSignUp } from '~/store/user/userHooks';
import axios from 'axios';
import { supabase } from '~/lib/supabaseClient'; // ตรวจว่ามีและชี้โปรเจกต์ถูก

interface ISignUpFormOptions { onSuccess?: () => void; }
export interface ISignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
  // name?: string;
  // phone?: string;
}

export function useSignUpForm(options: ISignUpFormOptions = {}) {
  const signUpLegacy = useUserSignUp(); // ตัวเดิมของธีม ถ้ายังใช้
  const { onSuccess } = options;
  const [serverError, setServerError] = useState<string | null>(null);

  const methods = useForm<ISignUpForm>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit } = methods;

  const [submit, submitInProgress] = useAsyncAction(async (data: ISignUpForm) => {
    setServerError(null);

    try {
      // 1) สมัครกับ Supabase Auth โดยตรง
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        // options: { data: { full_name: data.name } } // ถ้ามีฟิลด์เพิ่ม
      });

      if (signUpError) {
        console.error('Supabase signUp error:', signUpError);
        // แสดงข้อความจาก supabase ตรง ๆ จะช่วยดีบัก
        throw new Error(signUpError.message || 'SIGN_UP_FAILED');
      }

      // 2) (ถ้ายังอยากสมัครระบบเดิมของธีม) – หรือจะถอดออกก็ได้
      await signUpLegacy(data.email, data.password);

      // 3) ยิงไปสร้าง partner ที่ Odoo แบบไม่บล็อก UX
      const derivedName = (data.email || '').split('@')[0] || 'customer';
      axios.post('/api/odoo/create-partner', { email: data.email, name: derivedName })
        .catch((e) => console.warn('Odoo partner create failed:', e?.response?.data || e?.message));

      onSuccess?.();
    } catch (e: any) {
      setServerError(e?.message || 'UNKNOWN_ERROR');
    }
  }, [onSuccess, signUpLegacy]);

  return {
    submit: useMemo(() => handleSubmit(submit), [handleSubmit, submit]),
    submitInProgress: submitInProgress || methods.formState.isSubmitting,
    serverError,
    errors: methods.formState.errors,
    register: methods.register,
    watch: methods.watch,
  };
}
