export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-6 mt-auto">
      <p className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} PAEB. Tous droits réservés.
      </p>
    </footer>
  );
}