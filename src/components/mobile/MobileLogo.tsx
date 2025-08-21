// react
import React from 'react';
import Image from 'next/image'; 

function MobileLogo() {
    return (
        <div className="mobile-logo">
            {/* mobile-logo */}
            <Image
                src="/images/Logo-wipat.png"
                alt="วิพัฒน์ อะไหล่ยนต์"
                width={160}
                height={50}
                priority
                                />
            {/* mobile-logo / end */}
        </div>
    );
}

export default MobileLogo;
