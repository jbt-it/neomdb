import React from "react";
import Button from '@material-ui/core/Button';

const NotFound: React.FunctionComponent = () => {
  /*
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
  
  */
  return (
    <div className="App">
      <span style={{
        position: 'relative',
        top: 140,
        left: 600
      }}>
        <h1>Fehler: Diese Seite konnte nicht gefunden werden! 404</h1>
        <Button variant="contained" color="primary" href="./">Zurück zum Dashboard</Button>
      </span>
    </div>
  );
};

export default NotFound;
