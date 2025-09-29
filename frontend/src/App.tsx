import { store } from './Component/Redux/Store'
import AppRoutes from './Routes/AppRoutes'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { Spin } from 'antd'

let persistor = persistStore(store);

const App = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={
          <div className='flex h-[100vh] justify-center items-center'>
            <Spin />
          </div> 
        } persistor={persistor}>
          <AppRoutes />
        </PersistGate>
      </Provider>
    </>
  )
}

export default App