import React from 'react';
import { ConfigProvider } from 'antd';

import Loading from '@components/common/loading';
import AppLoading from '@modules/main/AppLoading';
import AppRoutes from '@routes/routes';

const App = () => (
    <React.Suspense fallback={<Loading show />}>
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 4,
                    fontFamily: 'Poppins',
                    colorPrimary: '#F69600',
                },
            }}
        >
            <AppLoading />
            <AppRoutes />
        </ConfigProvider>
    </React.Suspense>
);

export default App;
