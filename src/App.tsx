import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, theme } from 'antd';
import { 
    BookOutlined, 
    OrderedListOutlined, 
    LogoutOutlined,
    TeamOutlined,
    IdcardOutlined,
} from '@ant-design/icons';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './pages/Login';
import Books from './pages/Books';
import Orders from './pages/Orders';
import Operators from './pages/Operators';
import Subscribers from './pages/Subscribers';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const App = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const { token } = theme.useToken();

    if (!user && location.pathname !== '/login') {
        return <Navigate to="/login" replace />;
    }

    if (user && location.pathname === '/login') {
        return <Navigate to="/" replace />;
    }

    if (!user) {
        return <Login />;
    }

    const menuItems = [
        {
            key: '/books',
            icon: <BookOutlined />,
            label: 'Kitoblar',
            onClick: () => navigate('/books'),
        },
        {
            key: '/orders',
            icon: <OrderedListOutlined />,
            label: 'Buyurtmalar',
            onClick: () => navigate('/orders'),
        },
        ...(user?.role === 'admin' ? [
            {
                key: '/operators',
                icon: <IdcardOutlined />,
                label: 'Operatorlar',
                onClick: () => navigate('/operators'),
            },
            {
                key: '/subscribers',
                icon: <TeamOutlined />,
                label: 'Obunachilar',
                onClick: () => navigate('/subscribers'),
            },
        ] : []),
        ...(user?.role === 'operator' ? [
            {
                key: '/subscribers',
                icon: <TeamOutlined />,
                label: 'Obunachilar',
                onClick: () => navigate('/subscribers'),
            },
        ] : []),
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Chiqish',
            onClick: () => {
                logout();
                navigate('/login');
            },
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider 
                collapsible 
                collapsed={collapsed} 
                onCollapse={setCollapsed}
                style={{
                    background: token.colorBgContainer,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    position: 'sticky',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div style={{ 
                    height: '32px', 
                    margin: '16px',
                    textAlign: 'center',
                }}>
                   <img src="./logo.png" alt="logo" style={{ height: '100%', width: 100 }}/>
                </div>
                <Menu
                    theme="light"
                    defaultSelectedKeys={[location.pathname]}
                    selectedKeys={[location.pathname]}
                    mode="inline"
                    items={menuItems.filter(item => item.key !== 'logout')}
                    style={{ borderRight: 0, flex: 1 }}
                />
                <Menu
                    theme="light"
                    mode="inline"
                    items={[
                        { type: 'divider' },
                        {
                            key: 'logout',
                            icon: <LogoutOutlined />,
                            label: 'Chiqish',
                            onClick: () => {
                                logout();
                                navigate('/login');
                            },
                            danger: true
                        }
                    ]}
                    style={{ borderRight: 0, marginTop: 'auto' }}
                />
            </Sider>
            <Layout>
                <Header style={{ 
                    padding: '0 16px', 
                    background: token.colorBgContainer,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}>
                    <div>
                        <Text strong>{user.fullName}</Text>
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                            ({user.role === 'admin' ? 'Administrator' : 
                              user.role === 'operator' ? 'Operator' : 
                              'Foydalanuvchi'})
                        </Text>
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: token.colorBgContainer }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Navigate to="/books" />} />
                        
                        <Route path="/books" element={
                            <PrivateRoute>
                                <Books />
                            </PrivateRoute>
                        } />
                        
                        <Route path="/orders" element={
                            <PrivateRoute>
                                <Orders />
                            </PrivateRoute>
                        } />
                        
                        <Route path="/operators" element={
                            <PrivateRoute roles={['admin']}>
                                <Operators />
                            </PrivateRoute>
                        } />
                        
                        <Route path="/subscribers" element={
                            <PrivateRoute roles={['admin', 'operator']}>
                                <Subscribers />
                            </PrivateRoute>
                        } />
                        
                        <Route path="*" element={<Navigate to="/books" replace />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
