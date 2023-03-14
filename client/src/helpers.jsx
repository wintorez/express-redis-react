import _ from 'lodash'

export function formatValue(key, value) {
  if (key === 'Image Gallery') {
    if (_.isArray(value)) {
      return value.map((each) => (
        <figure key={each.src}>
          <img src={each.src} width="100%" alt={each.alt} />
          <br />
          <figcaption>{each.title}</figcaption>
        </figure>
      ))
    } else {
      return (
        <figure>
          <img src={value.src} width="100%" alt={value.alt} />
          <br />
          <figcaption>{value.title}</figcaption>
        </figure>
      )
    }
  }

  if (key === 'Species Illustration Photo') {
    return <img src={value.src} width="100%" />
  }

  if (_.isString(value)) {
    return <span dangerouslySetInnerHTML={{ __html: value }} />
  }

  return '-'
}
