interface JsonLdProps {
  data: Record<string, unknown>
}

/**
 * Transforma recursivamente las fechas en formato YYYY-MM-DD a ISO 8601 completo
 * Busca propiedades de fecha conocidas y las convierte automáticamente
 */
function transformDates(obj: Record<string, unknown>): Record<string, unknown> {
  const dateProperties = ['datePublished', 'dateModified', 'dateCreated', 'startDate', 'endDate']
  const result: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (dateProperties.includes(key) && typeof value === 'string' && !value.includes('T')) {
      // Convertir fecha YYYY-MM-DD a ISO 8601
      result[key] = `${value}T00:00:00Z`
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursivamente transformar objetos anidados
      result[key] = transformDates(value as Record<string, unknown>)
    } else {
      result[key] = value
    }
  }
  
  return result
}

export function JsonLd({ data }: JsonLdProps): React.ReactElement {
  const transformedData = transformDates(data)
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(transformedData).replace(/</g, "\\u003c"),
      }}
    />
  )
}
