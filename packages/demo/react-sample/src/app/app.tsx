import styles from './app.module.css';

import { ReactComponent as Logo } from './logo.svg';
import star from './star.svg';

import { Route, Link, withRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { AuthCallback } from './pages/AuthCallback';
import { Login } from './components/Login';
import { AuthConfig } from 'react-use-auth';
import { CommonsOauth } from '../../../../auth-hook/src/adapter/commons-oauth';
import { Page } from './pages/Page';

function App(props: any) {
  return (
    <div className={styles.app}>
      <AuthConfig authProvider={CommonsOauth as never}
                  navigate={props.history.push}
                  params={{ server: 'http://localhost:8080', clientId: '58846872854260736' }}>
        <header className='flex'>
          <Logo width='75' height='75' />
          <h1>Welcome to react-sample!</h1>
        </header>
        <Login />
        <hr />
        <div role='navigation'>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/page-2'>Page 2</Link>
            </li>
          </ul>
        </div>
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/auth_callback' exact>
          <AuthCallback />
        </Route>
        <Route path='/page-2' exact>
          <Page />
        </Route>
        {/* END: routes */}
      </AuthConfig>
    </div>
  );
}

export default withRouter(App);
