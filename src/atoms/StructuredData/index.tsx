/** JSON-LD for search engines; `<` is escaped so the JSON can't close the tag. */
export const StructuredData = ({ data }: { data: object }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
  />
);
