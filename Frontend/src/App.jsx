import {Routes,Route} from 'react-router-dom';
import Home from './components/home';


const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Form />}></Route>
        <Route path="/analysis" element={<CreditRiskDisplay />}></Route>
        <Route path="/whatif" element={<CreditRiskDisplay />}></Route>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </div>

  );
};

export default App;
