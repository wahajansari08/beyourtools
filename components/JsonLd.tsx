/**
 * Server-safe JSON-LD renderer.
 * Usage: <JsonLd data={schemaObject} />
 *        <JsonLd data={[schema1, schema2]} />
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
