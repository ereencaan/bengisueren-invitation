(function () {
  var openBtn = document.getElementById('openBtn');
  var envelopeWrapper = document.getElementById('envelopeWrapper');
  var invitation = document.getElementById('invitation');

  function openInvitation() {
    envelopeWrapper.classList.add('open');
    envelopeWrapper.classList.add('hidden');
    invitation.classList.remove('hidden');
  }

  if (openBtn && envelopeWrapper && invitation) {
    openBtn.addEventListener('click', openInvitation);
  }
})();
