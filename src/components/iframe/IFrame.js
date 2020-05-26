import React from 'react';

class Iframe extends React.Component {

    constructor(props) {
        super(props);

        this.iframe_ref = null
        this.writeHTML = this.writeHTML.bind(this)

    }
    writeHTML(frame){
        console.log('writeHTML')
        if(!frame) {
            return
        }

        this.iframe_ref = frame

        /* let doc = frame.contentDocument

         * doc.open()
         * doc.write(this.props.html)
         * doc.close()

         * frame.style.width = '100%'
         * frame.style.height = `${frame.contentWindow.document.body.scrollHeight}px` */
    }
    render() {

        if (!this.props.source) {
            return <div>Loading...</div>;
        }

        const src = this.props.source;
        return (
                <iframe title={this.props.title} src={src} ref={this.writeHTML} width='100%' height='100%'></iframe>
        );
    }
};

export default Iframe;
