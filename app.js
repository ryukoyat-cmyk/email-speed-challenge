const STUDENTS = window.STUDENTS || [];

const $ = (id) => document.getElementById(id);
const grade = $('grade'), classroom = $('classroom'), student = $('student');
const setup = $('setup-panel'), typing = $('typing-panel'), result = $('result-panel');
let selectedStudent = null, startedAt = 0, timerId = null, finalSeconds = 0;

function options(select, values, placeholder) { select.innerHTML = `<option value="">${placeholder}</option>` + values.map(v => `<option value="${v}">${v}</option>`).join(''); }
function unique(values) { return [...new Set(values)]; }
options(grade, unique(STUDENTS.map(s => s.grade)), '학년');
grade.addEventListener('change', () => { options(classroom, unique(STUDENTS.filter(s => s.grade === grade.value).map(s => s.classroom)), '반'); classroom.disabled = !grade.value; student.disabled = true; options(student, [], '이름'); $('start-btn').disabled = true; });
classroom.addEventListener('change', () => { options(student, STUDENTS.filter(s => s.grade === grade.value && s.classroom === classroom.value).map(s => s.name), '이름'); student.disabled = !classroom.value; $('start-btn').disabled = true; });
student.addEventListener('change', () => { selectedStudent = STUDENTS.find(s => s.grade === grade.value && s.classroom === classroom.value && s.name === student.value); $('start-btn').disabled = !selectedStudent; });

function setStep(step) { document.querySelectorAll('.progress-dot').forEach((dot, i) => dot.classList.toggle('active', i < step)); document.querySelectorAll('.step-labels span').forEach((label, i) => label.style.color = i === step - 1 ? 'var(--orange)' : ''); }
function resetTimer() { clearInterval(timerId); timerId = null; startedAt = 0; $('timer').textContent = '0.00'; }
function showTyping() { setup.classList.add('hidden'); result.classList.add('hidden'); typing.classList.remove('hidden'); setStep(2); $('student-chip').textContent = `${selectedStudent.grade} · ${selectedStudent.classroom} · ${selectedStudent.name}`; $('email-input').value = ''; resetTimer(); setTimeout(() => $('email-input').focus(), 50); }
$('start-btn').addEventListener('click', showTyping);
$('back-btn').addEventListener('click', () => { typing.classList.add('hidden'); setup.classList.remove('hidden'); setStep(1); resetTimer(); });
$('email-input').addEventListener('keydown', (e) => { if (e.key === ' ') { e.preventDefault(); $('input-message').textContent = '띄어쓰기는 사용할 수 없어요!'; return; } if (!startedAt && e.key.length === 1) { startedAt = performance.now(); timerId = setInterval(() => $('timer').textContent = ((performance.now() - startedAt) / 1000).toFixed(2), 30); } if (e.key === 'Enter') submit(); });
$('email-input').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\s/g, ''); });
async function hash(value) { const data = new TextEncoder().encode(value.trim().toLowerCase()); const buffer = await crypto.subtle.digest('SHA-256', data); return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join(''); }
async function submit() { const input = $('email-input').value.trim(); if (!input || !startedAt) { $('input-message').textContent = '이메일을 입력한 뒤 제출해 주세요.'; return; } const inputHash = await hash(input); const correct = inputHash === selectedStudent.emailHash; if (!correct) { $('input-message').textContent = '앗, 이메일이 정확하지 않아요. 다시 확인해 보세요!'; $('input-message').style.color = 'var(--orange)'; $('email-input').select(); return; } finalSeconds = (performance.now() - startedAt) / 1000; clearInterval(timerId); $('result-time').textContent = `${finalSeconds.toFixed(2)}초`; $('result-student').textContent = `${selectedStudent.grade} ${selectedStudent.classroom} ${selectedStudent.name}`; setup.classList.add('hidden'); typing.classList.add('hidden'); result.classList.remove('hidden'); setStep(3); }
$('submit-btn').addEventListener('click', submit);
function canvasBlob() { const canvas = document.createElement('canvas'); canvas.width = 900; canvas.height = 560; const ctx = canvas.getContext('2d'); ctx.fillStyle = '#ff7956'; ctx.fillRect(0, 0, 900, 560); ctx.fillStyle = '#fff0a8'; ctx.beginPath(); ctx.arc(770, 80, 140, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = '900 25px Nunito, sans-serif'; ctx.fillText('✉  SPEED CHALLENGE', 450, 130); ctx.font = '900 34px Nunito, sans-serif'; ctx.fillText(`${selectedStudent.grade} ${selectedStudent.classroom} ${selectedStudent.name}`, 450, 225); ctx.font = '900 90px Jua, sans-serif'; ctx.fillText(`${finalSeconds.toFixed(2)}초`, 450, 340); ctx.font = '700 22px Nunito, sans-serif'; ctx.fillText('✓ 이메일 계정을 정확하게 입력했습니다.', 450, 425); ctx.fillStyle = '#fff0a5'; ctx.font = '900 28px Nunito, sans-serif'; ctx.fillText('★  ★  ★', 450, 490); return new Promise(resolve => canvas.toBlob(resolve, 'image/png')); }
$('copy-btn').addEventListener('click', async () => { try { const blob = await canvasBlob(); await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); $('copy-message').textContent = '결과 이미지가 복사됐어요! Padlet에서 Ctrl+V 해 보세요.'; } catch { $('copy-message').textContent = '복사가 지원되지 않는 환경이에요. PNG 저장 후 올려 주세요.'; } });
$('download-btn').addEventListener('click', async () => { const blob = await canvasBlob(); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `speed-challenge-${selectedStudent.name}.png`; a.click(); URL.revokeObjectURL(url); });
$('retry-btn').addEventListener('click', showTyping);

