
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppLayout from './components/AppLayout';
import FormBuilderPage from './pages/FormBuilderPage';
import PreviewPage from './pages/PreviewPage';
import MyFormsPage from './pages/MyFormsPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/create" replace />} />
            <Route path="/create" element={<FormBuilderPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/myforms" element={<MyFormsPage />} />
            <Route path="*" element={<Navigate to="/create" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </Provider>
  );
}

export default App;