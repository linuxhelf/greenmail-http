import React from 'react'

function ShadowDom(props) {
	const {html} = props
	const ref = React.useRef(null);

	React.useEffect(() => {
		if (ref.current) {
			const shadow = ref.current.attachShadow({mode: 'open'});
			shadow.innerHTML = html;
		}
	}, [html]);

	return <div ref={ref} />
}

export default ShadowDom
