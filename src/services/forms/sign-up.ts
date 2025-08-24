// src/services/forms/sign-up.ts
// react
import { useMemo, useState } from 'react';
// third-party
import { useForm } from 'react-hook-form';
import axios from 'axios';
// application
import { useAsyncAction } from '~/store/hooks';
import { useUserSignUp } from '~/store/user/userHooks';

interface ISignUpFormOptions {
    onSuccess?: () => void;
}

export interface ISignUpForm {
    email: string;
    password: string;
    confirmPassword: string;
    // ถ้าอนาคตมีฟิลด์เพิ่ม (เช่น name, phone) ใส่ตรงนี้ได้เลย
    // name?: string;
    // phone?: string;
}

export function useSignUpForm(options: ISignUpFormOptions = {}) {
    const signUp = useUserSignUp();
    const { onSuccess } = options;
    const [serverError, setServerError] = useState<string | null>(null);

    const methods = useForm<ISignUpForm>({
        defaultValues: {
            email: 'user@example.com',
            password: '123456',
            confirmPassword: '123456',
        },
    });

    const { handleSubmit } = methods;

    const [submit, submitInProgress] = useAsyncAction(async (data: ISignUpForm) => {
        setServerError(null);

        try {
            // สมัครสมาชิกในเว็บ (ระบบเดิมของคุณ)
            await signUp(data.email, data.password);

            // ยิงไปสร้าง partner ใน Odoo — ไม่บล็อก UX ถ้าล้มเหลว
            // ชื่อ (name) จะ derive จากอีเมลก่อน @ หากคุณยังไม่มีฟิลด์ name ในฟอร์ม
            const derivedName = (data.email || '').split('@')[0] || 'customer';

            // fire-and-forget เพื่อไม่ให้หน้าค้าง (ไม่ต้องรอ)
            axios.post('/api/odoo/create-partner', {
                email: data.email,
                name: derivedName,
                // ถ้ามีฟิลด์ phone/name จริงในฟอร์มให้ส่งเพิ่มได้
                // phone: data.phone,
            }).catch((e) => {
                // เก็บ log เงียบ ๆ ไม่ให้ผู้ใช้เจอ error หน้าฟอร์ม
                // คุณจะเปลี่ยนเป็นส่งไป Sentry/Log service ก็ได้
                console.warn('ODoo partner create failed:', e?.response?.data || e?.message);
            });

            if (onSuccess) onSuccess();
        } catch (error: any) {
            setServerError(`ERROR_API_${error?.message || 'UNKNOWN'}`);
        }
    }, [signUp, onSuccess]);

    return {
        submit: useMemo(() => handleSubmit(submit), [handleSubmit, submit]),
        submitInProgress: submitInProgress || methods.formState.isSubmitting,
        serverError,
        errors: methods.formState.errors,
        register: methods.register,
        watch: methods.watch,
    };
}
