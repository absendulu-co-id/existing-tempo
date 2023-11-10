import React from "react";

function FuseSplashScreen() {
  return (
    <div id="fuse-splash-screen">
      <div className="center">
        <div className="logo">
          <picture>
            <source srcSet="assets/images/logos/logo.svg" type="image/svg+xml" />
            <img width="300" src="assets/images/logos/logo.png" alt="absendulu.id" />
          </picture>
        </div>
        <div className="spinner-wrapper">
          <div className="spinner">
            <div className="inner">
              <div className="gap" />
              <div className="left">
                <div className="half-circle" />
              </div>
              <div className="right">
                <div className="half-circle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(FuseSplashScreen);
