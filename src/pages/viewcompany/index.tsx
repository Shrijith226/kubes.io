import Data from '@/components/datatable/viewcompanytable';
import React from 'react';

const Viewcompany = () => {
    return (
        <div className='w-full'>
            
            <h1 className='text-black font-bold text-xl ml-3 mt-3'>Form</h1>
            <div className='flex flex-col md:flex-row w-full md:gap-20 ml-2 mr-2 mt-6'>
                <div className='md:w-1/2'>
                    <div className='flex flex-col md:flex-row justify-between pb-3 md:gap-7'>
                        <h1 className='text-black text-lg'>Company Name</h1>
                        <input type="text" className='border-2 border-black p-1 h-6 w-full md:w-48  text-black text-sm'placeholder="Company Name" />
                    </div>
                    <div className='flex flex-col md:flex-row justify-between pb-3 md:gap-7'>
                        <h1 className='text-black text-lg'>Discount</h1>
                        <input type="text" className='border-2 border-black p-1 h-6 w-full md:w-48  text-black text-sm'placeholder="Discount" />
                    </div>
                    <div className='flex flex-col md:flex-row justify-between pb-3 md:gap-7'>
                        <h1 className='text-black text-lg'>Created Date</h1>
                        <input type="text" className='border-2 border-black p-1 h-6 w-full md:w-48  text-black text-sm'placeholder="Created Date" />
                    </div>
                </div>
                <div className='md:w-1/2'>
                    <div className='flex flex-col md:flex-row justify-between  pb-3 md:gap-8'>
                        <h1 className='text-black text-lg'>Short Name</h1>
                        <input type="text" className='border-2 border-black p-1 h-6 w-full md:w-48  text-black text-sm'placeholder="Short Name" />
                    </div>
                    <div className='flex flex-col md:flex-row justify-between  pb-3 md:gap-8'>
                        <h1 className='text-black text-lg'>Daily Code</h1>
                        <input type="text" className='border-2 border-black p-1 h-6 w-full md:w-48  text-black text-sm'placeholder="Daily code" />
                    </div>
                    <div className='flex flex-col md:flex-row justify-between pb-3 md:gap-8'>
                        <h1 className='text-black text-lg'>Is Active</h1>
                        <input type="text" className='border-2 border-black p-1 h-6 w-full md:w-48  text-black text-sm'placeholder="Is Active" />
                    </div>
                </div>
            </div>
            <div className='flex justify-between mt-16'>
                <h1 className='text-black text-lg font-bold ml-3'>Customers</h1>
                <input type="text" className='border-2 border-black h-6 w-full md:w-48 p-1 text-black text-sm ml-3' placeholder="Free Text Search" />
            </div>
            <Data/>
            <button className='border-2 border-black h-6 w-24 text-center mt-6 text-blue-500 text-sm cursor-pointer'>close</button>
        </div>
    );
};

export default Viewcompany;
