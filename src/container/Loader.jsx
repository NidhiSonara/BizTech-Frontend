import Spinner from 'react-bootstrap/Spinner';

function Loader() {
  return(
    <div className="loader">
      <Spinner animation="grow" size="xl" />
    </div>
  );
}

export default Loader;