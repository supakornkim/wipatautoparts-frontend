// third-party
import { toast } from 'react-toastify';
// application
import { globalIntl } from '~/services/i18n/global-intl';
import { ICartItemOption } from '~/store/cart/cartTypes';
import { IProduct } from '~/interfaces/product';
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_UPDATE_QUANTITIES,
    CartAddItemAction,
    CartItemQuantity,
    CartRemoveItemAction,
    CartThunkAction,
    CartUpdateQuantitiesAction,
} from '~/store/cart/cartActionTypes';

/** ---------- Helpers: ตรวจ option ---------- */

// ถ้าสินค้ามี option (เช่น product.options เป็น array และยาว > 0) ให้ถือว่ามี
function productHasOptions(product: IProduct): boolean {
    const anyProduct = product as any;
    return Array.isArray(anyProduct?.options) && anyProduct.options.length > 0;
}

// ตรวจว่าเลือก option ครบตามกฎ (required) แล้วหรือยัง
// หมายเหตุ: โครงสร้าง option ในธีม/โปรเจกต์อาจต่างกันเล็กน้อย
// - ที่นี่สมมติว่า product.options = [{ name/slug, required, values?... }, ...]
// - และ options (ICartItemOption[]) = [{ name/slug, value }, ...]
function areOptionsComplete(product: IProduct, picked: ICartItemOption[] = []): boolean {
    const anyProduct = product as any;
    const prodOptions: any[] = Array.isArray(anyProduct?.options) ? anyProduct.options : [];

    // ถ้าไม่มี option เลย ถือว่าครบ
    if (prodOptions.length === 0) return true;

    // กรองเฉพาะ option ที่ required
    const requiredOptions = prodOptions.filter((o) => o?.required);

    // ถ้าไม่มี required ก็โอเค
    if (requiredOptions.length === 0) return true;

    // map สำหรับดูว่ามีการเลือก option ตรงกับ key ไหม
    // พยายามรองรับได้ทั้ง slug และ name
    const pickedMap = new Map<string, any>();
    picked.forEach((p) => {
        const key = (p as any).slug ?? (p as any).name;
        if (key) pickedMap.set(key, (p as any).value);
    });

    // ต้องมีค่าที่ไม่ว่างสำหรับทุก required option
    return requiredOptions.every((o) => {
        const key = o?.slug ?? o?.name;
        if (!key) return true; // ถ้า option ไม่มี key ชัดเจน จะไม่บังคับ
        const val = pickedMap.get(key);
        return val !== undefined && val !== null && String(val).trim().length > 0;
    });
}

/** ---------- Actions ---------- */

export function cartAddItemSuccess(
    product: IProduct,
    options: ICartItemOption[] = [],
    quantity = 1,
): CartAddItemAction {
    toast.success(
        globalIntl()?.formatMessage(
            { id: 'TEXT_TOAST_PRODUCT_ADDED_TO_CART' },
            { productName: product.name },
        ),
        { theme: 'colored' }
    );

    return {
        type: CART_ADD_ITEM,
        product,
        options,
        quantity,
    };
}

export function cartRemoveItemSuccess(itemId: number): CartRemoveItemAction {
    return {
        type: CART_REMOVE_ITEM,
        itemId,
    };
}

export function cartUpdateQuantitiesSuccess(quantities: CartItemQuantity[]): CartUpdateQuantitiesAction {
    return {
        type: CART_UPDATE_QUANTITIES,
        quantities,
    };
}

export function cartAddItem(
    product: IProduct,
    options: ICartItemOption[] = [],
    quantity = 1,
): CartThunkAction<Promise<void>> {
    // ✅ ปรับ logic:
    // - ถ้า "ไม่มี option" => ข้าม validation เพิ่มได้เลย
    // - ถ้า "มี option" แต่ยังไม่ครบ => แสดง error และไม่เพิ่ม
    const hasOptions = productHasOptions(product);
    const optionsOk = areOptionsComplete(product, options);

    if (hasOptions && !optionsOk) {
        toast.error(
            globalIntl()?.formatMessage({ id: 'ERROR_ADD_TO_CART_OPTIONS' }),
            { theme: 'colored' }
        );
        return () => Promise.resolve();
    }

    // sending request to server, timeout is used as a stub
    return (dispatch) => (
        new Promise((resolve) => {
            setTimeout(() => {
                dispatch(cartAddItemSuccess(product, options, quantity));
                resolve();
            }, 250);
        })
    );
}

export function cartRemoveItem(itemId: number): CartThunkAction<Promise<void>> {
    // sending request to server, timeout is used as a stub
    return (dispatch) => (
        new Promise((resolve) => {
            setTimeout(() => {
                dispatch(cartRemoveItemSuccess(itemId));
                resolve();
            }, 250);
        })
    );
}

export function cartUpdateQuantities(quantities: CartItemQuantity[]): CartThunkAction<Promise<void>> {
    // sending request to server, timeout is used as a stub
    return (dispatch) => (
        new Promise((resolve) => {
            setTimeout(() => {
                dispatch(cartUpdateQuantitiesSuccess(quantities));
                resolve();
            }, 250);
        })
    );
}
