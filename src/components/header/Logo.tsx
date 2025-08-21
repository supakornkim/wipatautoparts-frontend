// react
import React from 'react';
// third-party
import { FormattedMessage } from 'react-intl';
// application
import Image from 'next/image'; 
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';

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
                    <Image
                        src="/images/Logo-wipat.png"
                        alt="วิพัฒน์ อะไหล่ยนต์"
                        width={200}
                        height={60}
                        priority
                    />
                    {/* logo / end */}
                </div>
            </AppLink>
        </div>
    );
}

export default Logo;
