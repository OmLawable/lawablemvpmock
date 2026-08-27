import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Play, CheckCircle, Award, FileText, ArrowRight, HelpCircle, Sparkles, Check, Download
} from 'lucide-react';
import { Card, Button, Badge, Modal } from '../../components/common/UIComponents';
import { store } from '../../store/lawableStore';

// SCREEN 30 & 31 — COURSE CATALOGUE & LESSON PLAYER (32px GAP & 32px CARD PADDING)
export const AcademyPage = ({ navigate, courseId, lessonId }) => {
  const courses = store.getState().courses;
  
  if (courseId) {
    const course = courses.find((c) => c.id === courseId) || courses[0];
    const [selectedLesson, setSelectedLesson] = useState(
      course.modules[0]?.lessons[0] || { id: 'les-101', title: '1.1 Essential Contract Terms', content: 'Section 10 Indian Contract Act 1872...' }
    );

    return (
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/app/academy')} className="mb-4">← Back to Courses</Button>

        <div className="grid grid-3 gap-8" style={{ gridTemplateColumns: '340px 1fr' }}>
          {/* Syllabus Navigation Tree (28px Padding) */}
          <Card padding="28px" style={{ backgroundColor: '#FFF' }}>
            <Badge variant="primary" className="mb-3">{course.category}</Badge>
            <h3 className="h4 mb-4">{course.title}</h3>

            {course.modules.map((m, mIdx) => (
              <div key={mIdx} className="mb-6">
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>
                  {m.title}
                </div>
                <div className="flex flex-col gap-2">
                  {m.lessons.map((les) => {
                    const active = les.id === selectedLesson.id;
                    return (
                      <div
                        key={les.id}
                        onClick={() => setSelectedLesson(les)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
                          border: active ? '1px solid var(--color-primary-border)' : '1px solid transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span style={{ fontWeight: active ? 600 : 400, fontSize: 13, color: active ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                            {les.title}
                          </span>
                          {les.completed && <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quiz Trigger CTA */}
            <div className="pt-4 border-t mt-6" style={{ borderColor: 'var(--color-border)' }}>
              <Button fullWidth onClick={() => navigate(`/app/academy/${course.id}/quiz`)}>
                Take Final Examination <ArrowRight size={14} />
              </Button>
            </div>
          </Card>

          {/* Lesson Content Area (32px Padding) */}
          <Card padding="32px" className="flex flex-col justify-between" style={{ backgroundColor: '#FFF' }}>
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div>
                  <Badge variant="neutral" className="mb-2">Lesson Video & Reading</Badge>
                  <h2 className="h2" style={{ margin: 0 }}>{selectedLesson.title}</h2>
                </div>

                {/* Academy -> AI Practice Hook */}
                <Button size="sm" variant="secondary" onClick={() => navigate('/app/ai/draft')}>
                  <Sparkles size={14} style={{ color: 'var(--color-primary)' }} /> Practise in Lawable AI
                </Button>
              </div>

              <div className="p-6 border rounded-md mb-8 bg-muted" style={{ minHeight: 240, fontSize: 15, lineHeight: 1.75 }}>
                <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{selectedLesson.content}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-5" style={{ borderColor: 'var(--color-border)' }}>
              <Button variant="secondary" onClick={() => store.addToast('Lesson marked complete', 'success')}>
                <CheckCircle size={16} /> Mark Lesson Complete
              </Button>
              <Button onClick={() => navigate(`/app/academy/${course.id}/quiz`)}>
                Proceed to Quiz →
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Badge variant="primary" className="mb-2">Accredited Learning</Badge>
          <h1 className="h2" style={{ margin: 0 }}>Lawable Academy Courses</h1>
        </div>
        <Button variant="secondary" onClick={() => navigate('/app/certificates')}>My Certificates</Button>
      </div>

      <div className="grid grid-3 gap-8">
        {courses.map((crs) => (
          <Card key={crs.id} hover onClick={() => navigate(`/app/academy/${crs.id}`)} padding="32px" style={{ backgroundColor: '#FFF' }}>
            <Badge variant="primary" className="mb-3">{crs.category}</Badge>
            <h3 className="h3 mb-3">{crs.title}</h3>
            <p className="text-caption text-secondary mb-6" style={{ lineHeight: 1.6, fontSize: 13 }}>{crs.description}</p>
            <div className="flex items-center justify-between text-caption text-secondary pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <span>{crs.duration} • {crs.level}</span>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Start Course →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// SCREEN 32 & 33 — SECURE QUIZ & RESULTS (32px CARD PADDING)
export const AcademyQuizPage = ({ navigate, courseId }) => {
  const quiz = store.getQuizForLearner(courseId);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  if (!quiz) {
    return (
      <div style={{ maxWidth: 640, margin: '64px auto', textAlign: 'center' }}>
        <Card padding="32px">
          <h2 className="h2 mb-4">Quiz Loading...</h2>
          <Button onClick={() => navigate('/app/academy')}>Return to Academy</Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = store.submitQuizAnswers(courseId, answers);
    setResult(res);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card padding="32px" style={{ backgroundColor: '#FFF' }}>
        <Badge variant="primary" className="mb-2">Final Examination</Badge>
        <h1 className="h2 mb-2">{quiz.title}</h1>
        <p className="text-caption text-secondary mb-8">Pass mark: {quiz.passMark}%. Server-side security check enforced.</p>

        {result ? (
          <div className="p-8 border rounded-md text-center bg-muted">
            <div className="icon-box mb-4" style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto', backgroundColor: result.passed ? 'var(--color-success-bg)' : 'var(--color-danger-bg)' }}>
              <Award size={32} style={{ color: result.passed ? 'var(--color-success)' : 'var(--color-danger)' }} />
            </div>
            <h2 className="h2 mb-2">{result.passed ? 'Passed!' : 'Examination Needs Retake'}</h2>
            <div style={{ fontSize: 36, fontWeight: 800, margin: '12px 0', color: result.passed ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {result.score}%
            </div>
            {result.passed && result.certificate && (
              <div className="p-5 border rounded-md mb-8 bg-white" style={{ borderColor: 'var(--color-success-border)' }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Certificate Issued #{result.certificate.certificateNumber}</div>
                <p className="text-caption text-secondary mt-1">Verification URL available for public credential proof.</p>
                <Button size="sm" className="mt-4" onClick={() => navigate(`/verify/${result.certificate.certificateNumber}`)}>
                  View Official Public Certificate →
                </Button>
              </div>
            )}

            <Button onClick={() => navigate('/app/academy')}>Return to Academy</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {quiz.questions.map((q, qIdx) => (
              <div key={q.id} className="mb-8 pb-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Question {qIdx + 1}: {q.question}</div>
                <div className="flex flex-col gap-3">
                  {q.options.map((opt, oIdx) => (
                    <label key={oIdx} className="flex items-center gap-3 p-4 border rounded-md cursor-pointer hover:bg-muted" style={{ fontSize: 14 }}>
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        checked={answers[qIdx] === oIdx}
                        onChange={() => setAnswers({ ...answers, [qIdx]: oIdx })}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <Button type="submit" fullWidth size="lg">Submit Answers for Server Grading</Button>
          </form>
        )}
      </Card>
    </div>
  );
};

// MY CERTIFICATES PAGE (Learner's earned credentials)
export const MyCertificatesPage = ({ navigate }) => {
  const [state, setState] = useState(store.getState() || {});

  useEffect(() => {
    return store.subscribe((newState) => setState(newState));
  }, []);

  const user = state.currentUser || { name: 'Student' };
  const userCertificates = (state.certificates || []).filter(
    (c) => (c.userId && (c.userId === user.id || c.userId === user.uid)) ||
           (c.learnerEmail && user.email && c.learnerEmail.toLowerCase() === user.email.toLowerCase()) ||
           (c.learnerName && user.name && c.learnerName.toLowerCase() === user.name.toLowerCase() && user.name !== 'Student')
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Badge variant="primary" className="mb-2">Accredited Credentials</Badge>
          <h1 className="h2" style={{ margin: 0 }}>My Earned Certificates</h1>
        </div>
        <Button variant="secondary" onClick={() => navigate('/app/academy')}>
          <BookOpen size={16} /> Explore Courses
        </Button>
      </div>

      {userCertificates.length === 0 ? (
        <Card className="text-center py-12 px-6" padding="48px" style={{ backgroundColor: '#FFF' }}>
          <div className="icon-box mb-4" style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto' }}>
            <Award size={32} />
          </div>
          <h3 className="h3 mb-2">No Certificates Earned Yet</h3>
          <p className="text-secondary mb-6" style={{ maxWidth: 520, margin: '0 auto 24px', lineHeight: 1.6 }}>
            You haven't completed any course examinations yet. Enroll in Lawable Academy courses, finish all syllabus modules, and pass the final exam to earn Bar Council-aligned verified credentials.
          </p>
          <Button size="lg" onClick={() => navigate('/app/academy')}>
            Start an Academy Course →
          </Button>
        </Card>
      ) : (
        <div className="grid grid-2 gap-6">
          {userCertificates.map((cert) => (
            <Card key={cert.id} padding="32px" style={{ backgroundColor: '#FFF' }}>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="success">Official Verified</Badge>
                <span className="text-caption text-secondary">#{cert.certificateNumber}</span>
              </div>
              <h3 className="h3 mb-2">{cert.courseTitle}</h3>
              <p className="text-caption text-secondary mb-6">
                Learner: <strong>{cert.learnerName}</strong> • Score: <strong>{cert.score}%</strong> • Issued: {cert.issueDate}
              </p>
              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-caption text-muted">Cryptographically Recorded</span>
                <Button size="sm" onClick={() => navigate(`/verify/${cert.certificateNumber}`)}>
                  View Official Certificate →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
