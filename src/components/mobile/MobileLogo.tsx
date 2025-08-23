// react
import React from 'react';
import AppImage from '~/components/shared/AppImage'; 

function MobileLogo() {
    return (
        <div className="mobile-logo">
            {/* mobile-logo */}
            <AppImage 
                src="/images/Logo-wipat.png" 
                alt="วิพัฒน์ อะไหล่ยนต์" 
                style={{ maxWidth: '56%', height: 'auto' }}
            />
            {/* mobile-logo / end */}
        </div>
    );
}

export default MobileLogo;
