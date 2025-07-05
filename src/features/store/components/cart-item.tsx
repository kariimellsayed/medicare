import { useContext, useState } from 'react';

import { Spin, message } from 'antd';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

import { AuthContext } from '@/features/store/context/auth-context';
import onAxios from '@/features/store/utils';

interface Product {
   id: number;
   imageSrc?: string;
   name: string;
   price: number;
   subTotal?: number;
}

interface CartItemProps {
   product: Product;
   quantity: number;
}

const CartItem = ({ product, quantity }: CartItemProps) => {
   const [currentQuantity, setCurrentQuantity] = useState<number>(quantity);
   const [deleting, setDeleting] = useState<boolean>(false);
   const [imageError, setImageError] = useState(false); // ✅ حالة فشل الصورة

   const { getCarts } = useContext(AuthContext) as { getCarts: () => void };

   const deleteCart = (id: number) => {
      setDeleting(true);
      onAxios
         .delete(`/api/e-commerce/cart/destroy/${id}`)
         .then(() => {
            getCarts();
            message.success(
               'The product has been removed from your shopping cart.'
            );
         })
         .catch((err) => {
            console.log(err);
            message.error('Failed to remove the product.');
         })
         .finally(() => {
            setDeleting(false);
         });
   };

   const updateCart = (id: number, newQuantity: number) => {
      onAxios
         .put(`/api/e-commerce/cart/update/${id}`, { quantity: newQuantity })
         .then(() => {
            getCarts();
            message.success(
               'The product quantity has been updated successfully.'
            );
         })
         .catch((err) => {
            console.error(err);
            message.error('An error occurred while updating the cart.');
         });
   };

   const handleQuantityChange = (delta: number) => {
      const newQuantity = currentQuantity + delta;
      if (newQuantity < 1) return;

      setCurrentQuantity(newQuantity);
      updateCart(product.id, newQuantity);
   };

   return (
      <div className='flex border-b py-6'>
         <div className='flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border bg-gray-100'>
            {!imageError ? (
               <img
                  src={product.imageSrc}
                  alt={product.name}
                  className='h-full w-full object-contain object-center'
                  onError={() => setImageError(true)}
               />
            ) : (
               <div className='flex h-full w-full items-center justify-center text-2xl font-bold text-gray-500'>
                  {product.name?.charAt(0).toUpperCase() || '?'}
               </div>
            )}
         </div>

         {/* Product details */}
         <div className='ml-4 flex flex-1 flex-col'>
            <div>
               <div className='flex justify-between'>
                  <h3>
                     <a
                        href={`/product/${product.id}`}
                        className='font-medium text-gray-700 hover:text-brand-blue'
                     >
                        {product.name}
                     </a>
                  </h3>
                  <Button
                     variant='ghost'
                     size='icon'
                     className='h-6 w-6 text-gray-400 hover:text-gray-600'
                     onClick={() => deleteCart(product.id)}
                     disabled={deleting}
                  >
                     {deleting ? <Spin size='small' /> : <X size={16} />}
                  </Button>
               </div>
            </div>
            <div className='flex flex-1 items-end justify-between text-sm'>
               <div className='flex items-center'>
                  <Button
                     variant='ghost'
                     size='icon'
                     onClick={() => handleQuantityChange(-1)}
                     className='h-8 w-8'
                  >
                     <ChevronDown size={16} />
                  </Button>

                  <span className='mx-2 w-5 text-center'>
                     {currentQuantity}
                  </span>

                  <Button
                     variant='ghost'
                     size='icon'
                     onClick={() => handleQuantityChange(1)}
                     className='h-8 w-8'
                  >
                     <ChevronUp size={16} />
                  </Button>
               </div>

               <div className='text-right'>
                  <p className='font-medium text-gray-900'>
                     EGP {(product.price * currentQuantity).toFixed(2)}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CartItem;
