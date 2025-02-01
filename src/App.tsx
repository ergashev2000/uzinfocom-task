import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, theme, Button, Drawer } from 'antd';
import { 
    BookOutlined, 
    OrderedListOutlined, 
    LogoutOutlined,
    TeamOutlined,
    IdcardOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './config/PrivateRoute';
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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const { token } = theme.useToken();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const sidebarContent = (
        <>
            <div style={{ 
                height: '32px', 
                margin: '16px',
                textAlign: 'center',
            }}>
               <img src="./logo.png" alt="logo" style={{ height: '100%', width: isMobile ? 80 : 100 }}/>
            </div>
            <Menu
                theme="light"
                defaultSelectedKeys={[location.pathname]}
                selectedKeys={[location.pathname]}
                mode="inline"
                items={menuItems.filter(item => item.key !== 'logout')}
                style={{ borderRight: 0, flex: 1 }}
                onClick={({ key }) => {
                    if (isMobile) {
                        setDrawerVisible(false);
                    }
                    menuItems.find(item => item.key === key)?.onClick?.();
                }}
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
                            if (isMobile) {
                                setDrawerVisible(false);
                            }
                            logout();
                            navigate('/login');
                        },
                        danger: true
                    }
                ]}
                style={{ borderRight: 0, marginTop: 'auto' }}
            />
        </>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {!isMobile ? (
                <Sider 
                    collapsible 
                    collapsed={collapsed} 
                    onCollapse={setCollapsed}
                    style={{
                        background: token.colorBgContainer,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        zIndex: 999,
                    }}
                >
                    {sidebarContent}
                </Sider>
            ) : (
                <Drawer
                    placement="left"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                    width={250}
                    styles={{
                        body: {
                            padding: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }
                    }}
                >
                    {sidebarContent}
                </Drawer>
            )}
            <Layout style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 200) }}>
                <Header style={{ 
                    padding: '0 16px', 
                    background: token.colorBgContainer,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                    {isMobile && (
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={() => setDrawerVisible(true)}
                            style={{ marginRight: 16 }}
                        />
                    )}
                    <div>
                        <Text strong>{user.fullName}</Text>
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                            ({user.role === 'admin' ? 'Administrator' : 
                              user.role === 'operator' ? 'Operator' : 
                              'Foydalanuvchi'})
                        </Text>
                    </div>
                </Header>
                <Content style={{ 
                    margin: isMobile ? '12px' : '24px 16px', 
                    borderRadius: token.borderRadiusLG, 
                    padding: isMobile ? 16 : 24, 
                    background: token.colorBgContainer 
                }}>
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
