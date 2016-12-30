import React from 'react';

export default function App({ children }) {
    return (
        <div style={styles.app}>
            {children}
        </div>
    );
}

App.propTypes = {
    children: React.PropTypes.element,
};

const styles = {
    app: {
        height: '100%',
        width: '100%',
        backgroundColor: 'blue',
    },
};
