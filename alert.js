// Dodajemy styl do head
const style = document.createElement('style');
style.textContent = `
  .data-alert {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #f72585;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(247, 37, 133, 0.3);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 9999;
    animation: fadeIn 0.5s ease;
    max-width: 90%;
    text-align: center;
  }
  
  .data-alert-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  
  .data-alert-close {
    background: none;
    border: none;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    margin-left: 10px;
    padding: 0 5px;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  
  @media (max-width: 768px) {
    .data-alert {
      padding: 10px 16px;
      font-size: 0.9rem;
    }
  }
`;

document.head.appendChild(style);

// Tworzymy i dodajemy alert
const alertDiv = document.createElement('div');
alertDiv.className = 'data-alert';
alertDiv.innerHTML = `
  <span class="data-alert-icon">⚠️</span>
  <span>Uwaga: Dane prezentowane na tej stronie mają charakter testowy i mogą nie być aktualne.</span>
  <button class="data-alert-close" aria-label="Zamknij powiadomienie">&times;</button>
`;

document.body.appendChild(alertDiv);

// Obsługa przycisku zamknięcia
const closeButton = alertDiv.querySelector('.data-alert-close');
closeButton.addEventListener('click', () => {
  alertDiv.style.opacity = '0';
  setTimeout(() => alertDiv.remove(), 300);
});