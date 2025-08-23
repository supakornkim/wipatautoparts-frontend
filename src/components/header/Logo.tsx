// react
import React from 'react';
// third-party
import { FormattedMessage } from 'react-intl';
// application
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';
import AppImage from '~/components/shared/AppImage'; 

interface Props extends React.HTMLAttributes<HTMLElement> {}

function Logo(props: Props) {
    return (
        <div {...props}>
            <AppLink href={url.home()} className="logo">
                <div className="logo__slogan">
                    <FormattedMessage id="TEXT_SLOGAN" />
                </div>
                <div className="logo__image">
                    {/* logo */}
                    <AppImage 
                        src="/images/Logo-wipat.png" 
                        alt="วิพัฒน์ อะไหล่ยนต์" 
                        style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                    />
                    {/* logo / end */}
                </div>
            </AppLink>
        </div>
    );
}

export default Logo;
