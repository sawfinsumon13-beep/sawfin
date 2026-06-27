/** Reviews page — profile grid + scroll-to-review */

const REVIEW_PROFILES = [
  { initials: 'MK', name: 'Markus', id: 'review-markus-klein' },
  { initials: 'PN', name: 'Petra', id: 'review-petra-novak' },
  { initials: 'DW', name: 'David', id: 'review-david-walsh' },
  { initials: 'AL', name: 'Antoine', id: 'review-antoine-laurent' },
  { initials: 'HB', name: 'Henrik', id: 'review-henrik-bergstrom' },
  { initials: 'RM', name: 'Ricardo', id: 'review-ricardo-mendes' },
  { initials: 'KN', name: 'Katarzyna', id: 'review-katarzyna-nowak' },
  { initials: 'TB', name: 'Tom', id: 'review-tom-becker' },
  { initials: 'EV', name: 'Elena', id: 'review-elena-varga' },
  { initials: 'NC', name: 'Nathan', id: 'review-nathan-cole' },
  { initials: 'IS', name: 'Ingrid', id: 'review-ingrid-sorensen' },
  { initials: 'FG', name: 'Fabio', id: 'review-fabio-greco' },
  { initials: 'LW', name: 'Lukas', id: 'review-list' },
  { initials: 'CM', name: 'Claire', id: 'review-list' },
  { initials: 'JP', name: 'Jan', id: 'review-list' },
  { initials: 'OR', name: 'Olivia', id: 'review-list' },
  { initials: 'VT', name: 'Viktor', id: 'review-list' },
  { initials: 'SM', name: 'Stefan', id: 'review-list' },
  { initials: 'AB', name: 'Anna', id: 'review-list' },
  { initials: 'GH', name: 'George', id: 'review-list' },
  { initials: 'YI', name: 'Yuki', id: 'review-list' },
  { initials: 'BR', name: 'Bruno', id: 'review-list' },
  { initials: 'ML', name: 'Marta', id: 'review-list' },
  { initials: 'DK', name: 'Dennis', id: 'review-list' },
  { initials: 'HF', name: 'Hannah', id: 'review-list' },
  { initials: 'PL', name: 'Paul', id: 'review-list' },
  { initials: 'RS', name: 'Rosa', id: 'review-list' },
  { initials: 'WK', name: 'Willem', id: 'review-list' },
  { initials: 'TG', name: 'Tobias', id: 'review-list' },
  { initials: 'NJ', name: 'Nina', id: 'review-list' },
  { initials: 'AC', name: 'Adam', id: 'review-list' },
  { initials: 'IK', name: 'Ivan', id: 'review-list' },
  { initials: 'LS', name: 'Laura', id: 'review-list' },
  { initials: 'MO', name: 'Miguel', id: 'review-list' },
  { initials: 'ER', name: 'Erik', id: 'review-list' },
  { initials: 'KF', name: 'Klara', id: 'review-list' },
  { initials: 'BD', name: 'Bjorn', id: 'review-list' },
  { initials: 'SV', name: 'Sven', id: 'review-list' },
  { initials: 'CH', name: 'Chris', id: 'review-list' },
  { initials: 'DR', name: 'Daniel', id: 'review-list' },
  { initials: 'EM', name: 'Emma', id: 'review-list' },
  { initials: 'FL', name: 'Felix', id: 'review-list' },
  { initials: 'GR', name: 'Greta', id: 'review-list' },
  { initials: 'HT', name: 'Hugo', id: 'review-list' },
  { initials: 'JL', name: 'Julia', id: 'review-list' },
  { initials: 'KR', name: 'Karl', id: 'review-list' },
  { initials: 'LN', name: 'Lena', id: 'review-list' },
  { initials: 'MP', name: 'Marco', id: 'review-list' },
  { initials: 'NO', name: 'Noah', id: 'review-list' },
  { initials: 'OS', name: 'Oscar', id: 'review-list' },
  { initials: 'PV', name: 'Pavel', id: 'review-list' },
  { initials: 'QH', name: 'Quinn', id: 'review-list' },
  { initials: 'RL', name: 'Ralf', id: 'review-list' },
  { initials: 'SK', name: 'Sara', id: 'review-list' },
  { initials: 'TM', name: 'Tim', id: 'review-list' },
  { initials: 'UR', name: 'Uwe', id: 'review-list' },
  { initials: 'VL', name: 'Vera', id: 'review-list' },
  { initials: 'WR', name: 'Walter', id: 'review-list' },
  { initials: 'XL', name: 'Xavier', id: 'review-list' },
  { initials: 'YS', name: 'Yann', id: 'review-list' },
  { initials: 'ZN', name: 'Zoe', id: 'review-list' },
  { initials: 'AA', name: 'Aiden', id: 'review-list' },
  { initials: 'BB', name: 'Bianca', id: 'review-list' },
  { initials: 'CC', name: 'Cedric', id: 'review-list' },
  { initials: 'DD', name: 'Diana', id: 'review-list' },
  { initials: 'EE', name: 'Edward', id: 'review-list' },
  { initials: 'FF', name: 'Fiona', id: 'review-list' },
  { initials: 'GG', name: 'Gavin', id: 'review-list' },
  { initials: 'HH', name: 'Helena', id: 'review-list' },
  { initials: 'II', name: 'Iris', id: 'review-list' },
  { initials: 'JJ', name: 'Jonas', id: 'review-list' },
  { initials: 'KK', name: 'Kim', id: 'review-list' },
  { initials: 'LL', name: 'Leo', id: 'review-list' },
  { initials: 'MM', name: 'Mona', id: 'review-list' },
  { initials: 'NN', name: 'Nils', id: 'review-list' },
  { initials: 'OO', name: 'Otto', id: 'review-list' },
  { initials: 'PP', name: 'Pia', id: 'review-list' },
  { initials: 'QQ', name: 'Quentin', id: 'review-list' },
  { initials: 'RR', name: 'Renee', id: 'review-list' },
  { initials: 'SS', name: 'Simon', id: 'review-list' },
  { initials: 'TT', name: 'Tina', id: 'review-list' },
];

function renderProfiles() {
  const grid = document.getElementById('review-profiles-grid');
  if (!grid) return;

  grid.innerHTML = REVIEW_PROFILES.map((p, i) => `
    <button type="button" class="review-profile-chip" data-target="${p.id}" data-index="${i}" aria-label="Jump to ${p.name}'s review">
      <span class="review-profile-avatar">${p.initials}<span class="review-verified" aria-hidden="true">✓</span></span>
      <span class="review-profile-name">${p.name}</span>
    </button>
  `).join('');

  grid.querySelectorAll('.review-profile-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.review-profile-chip').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.add('review-item--highlight');
        setTimeout(() => target.classList.remove('review-item--highlight'), 2000);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', renderProfiles);
