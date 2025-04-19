import {Routes,Route} from 'react-router-dom';
import Home from './components/home';
import Form from "./components/form";
import CreditRiskDisplay from './components/datadisplay';
import Recommendations from './components/Recommendations';

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Form />}></Route>
        <Route path="/analysis" element={<CreditRiskDisplay />}></Route>
        <Route path="/recommendations" element={<Recommendations />}></Route>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </div>

  );
};

export default App;
