import React from "react";

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="inline-flex items-center justify-center bg-primary text-white p-4 rounded-xl mb-4">
        <i className="fas fa-book-open text-2xl"></i>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Summarizer</h1>
      <p className="text-gray-600">
        Transforme qualquer livro em um resumo inteligente com o poder da IA
      </p>
    </header>
  );
};

export default Header;
