"""
ClinicOS - Flask Backend API
Full REST API: Auth, Doctors, Appointments, Payments, Medicines, Orders, Vaccination
"""
import json
import uuid
import sqlite3
from datetime import datetime, date, timedelta
from functools import wraps
from flask import Flask, request, jsonify, session, redirect, url_for, render_template, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from database import init_db, get_db, DEFAULT_VACCINE_SCHEDULE

app = Flask(__name__, static_folder='.', static_url_path='', template_folder='templates')
app.secret_key = 'clinicos-secret-key-2026-xK9mN3pQ'
CORS(app, supports_credentials=True)

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated

def row_to_dict(row):
    if row is None:
        return None
    return dict(row)

def rows_to_list(rows):
    return [dict(r) for r in rows]

def gen_txn():
    return 'TXN' + uuid.uuid4().hex[:12].upper()

def available_dates():
    """Return next 7 weekday dates"""
    result = []
    d = date.today() + timedelta(days=1)
    while len(result) < 8:
        if d.weekday() < 6:  # Mon–Sat
            result.append(d.strftime('%Y-%m-%d'))
        d += timedelta(days=1)
    return result

# ─────────────────────────────────────────────
# STATIC ROUTES
# ─────────────────────────────────────────────
@app.route('/')
def index():
    if 'user_id' in session:
        return redirect('/dashboard')
    return redirect('/login')

@app.route('/login')
def login_page():
    if 'user_id' in session:
        return redirect('/dashboard')
    return render_template('login.html')

@app.route('/dashboard')
@app.route('/dashboard/<path:subpath>')
def dashboard_page(subpath=''):
    if 'user_id' not in session:
        return redirect('/login')
    return render_template('app.html')

# Serve css / js / assets from project root
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

# ─────────────────────────────────────────────
# AUTH API
# ─────────────────────────────────────────────
@app.route('/api/auth/register', methods=['POST'])
def api_register():
    data = request.json or {}
    name = data.get('name','').strip()
    email = data.get('email','').strip().lower()
    password = data.get('password','')
    role = data.get('role','patient')
    phone = data.get('phone','').strip()

    if not name or not email or not password:
        return jsonify({'error': 'Name, email and password are required'}), 400
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    db = get_db()
    try:
        db.execute(
            "INSERT INTO users (name,email,password_hash,role,phone) VALUES (?,?,?,?,?)",
            (name, email, generate_password_hash(password), role, phone)
        )
        user_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]

        # If registering as doctor, create doctor profile
        if role == 'doctor':
            specialty = data.get('specialty','General Medicine')
            fee = int(data.get('fee', 499))
            experience = data.get('experience','1 year')
            bio = data.get('bio','')
            db.execute(
                "INSERT INTO doctors (user_id,specialty,fee,experience,bio) VALUES (?,?,?,?,?)",
                (user_id, specialty, fee, experience, bio)
            )

        db.commit()
        # Auto-login
        user = row_to_dict(db.execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone())
        session['user_id'] = user_id
        session['role'] = role
        return jsonify({'message':'Account created!', 'user': _safe_user(user)}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already registered'}), 409
    finally:
        db.close()

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.json or {}
    email = data.get('email','').strip().lower()
    password = data.get('password','')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    db = get_db()
    user = row_to_dict(db.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone())
    db.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid email or password'}), 401

    session['user_id'] = user['id']
    session['role'] = user['role']
    return jsonify({'message':'Login successful', 'user': _safe_user(user)})

@app.route('/api/auth/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify({'message':'Logged out'})

@app.route('/api/auth/me')
def api_me():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    db = get_db()
    user = row_to_dict(db.execute("SELECT * FROM users WHERE id=?", (session['user_id'],)).fetchone())
    db.close()
    if not user:
        session.clear()
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': _safe_user(user)})

def _safe_user(u):
    if not u:
        return None
    return {k: v for k, v in u.items() if k != 'password_hash'}

# ─────────────────────────────────────────────
# SPECIALTIES API
# ─────────────────────────────────────────────
SPECIALTIES = [
    {'id':'cardiology','name':'Cardiology','icon':'❤️','desc':'Heart, BP, ECG, Arrhythmia'},
    {'id':'neurology','name':'Neurology','icon':'🧠','desc':'Migraine, Stroke, Memory'},
    {'id':'orthopedics','name':'Orthopedics','icon':'🦴','desc':'Joint, Bone, Sports Injury'},
    {'id':'paediatrics','name':'Paediatrics','icon':'👶','desc':'Child Health, Vaccines, Fever'},
    {'id':'dermatology','name':'Dermatology','icon':'✨','desc':'Skin, Hair, Acne, Allergy'},
    {'id':'general medicine','name':'General Medicine','icon':'🩺','desc':'Fever, Cold, Checkup'},
    {'id':'gynaecology','name':'Gynaecology','icon':'🌸','desc':'Women\'s Health, Pregnancy'},
    {'id':'psychiatry','name':'Psychiatry','icon':'🧘','desc':'Anxiety, Depression, Therapy'},
]

@app.route('/api/specialties')
def api_specialties():
    return jsonify({'specialties': SPECIALTIES})

# ─────────────────────────────────────────────
# DOCTORS API
# ─────────────────────────────────────────────
@app.route('/api/doctors')
def api_doctors():
    specialty = request.args.get('specialty','')
    db = get_db()
    if specialty:
        rows = db.execute("""
            SELECT d.*, u.name, u.email, u.phone, u.avatar_url
            FROM doctors d JOIN users u ON d.user_id=u.id
            WHERE LOWER(d.specialty)=LOWER(?) AND d.is_active=1
        """, (specialty,)).fetchall()
    else:
        rows = db.execute("""
            SELECT d.*, u.name, u.email, u.phone, u.avatar_url
            FROM doctors d JOIN users u ON d.user_id=u.id
            WHERE d.is_active=1
        """).fetchall()
    db.close()
    return jsonify({'doctors': rows_to_list(rows)})

@app.route('/api/doctors/<int:doc_id>')
def api_doctor_detail(doc_id):
    db = get_db()
    row = db.execute("""
        SELECT d.*, u.name, u.email, u.phone, u.avatar_url
        FROM doctors d JOIN users u ON d.user_id=u.id
        WHERE d.id=?
    """, (doc_id,)).fetchone()
    db.close()
    if not row:
        return jsonify({'error':'Doctor not found'}), 404
    doc = row_to_dict(row)
    doc['available_dates'] = available_dates()
    return jsonify({'doctor': doc})

@app.route('/api/doctors/<int:doc_id>/slots')
def api_doctor_slots(doc_id):
    sel_date = request.args.get('date', date.today().strftime('%Y-%m-%d'))
    db = get_db()
    doc = row_to_dict(db.execute("SELECT slots FROM doctors WHERE id=?", (doc_id,)).fetchone())
    # Find already booked slots for that date
    booked = [r['slot'] for r in rows_to_list(db.execute(
        "SELECT slot FROM appointments WHERE doctor_id=? AND appt_date=? AND status NOT IN ('cancelled')",
        (doc_id, sel_date)
    ).fetchall())]
    db.close()
    if not doc:
        return jsonify({'error':'Doctor not found'}), 404
    all_slots = json.loads(doc['slots'])
    result = [{'slot':s, 'available': s not in booked} for s in all_slots]
    return jsonify({'slots': result, 'date': sel_date})

# ─────────────────────────────────────────────
# APPOINTMENTS API
# ─────────────────────────────────────────────
@app.route('/api/appointments', methods=['GET'])
@login_required
def api_get_appointments():
    db = get_db()
    uid = session['user_id']
    role = session.get('role','patient')

    if role == 'doctor':
        doc = row_to_dict(db.execute("SELECT id FROM doctors WHERE user_id=?", (uid,)).fetchone())
        if not doc:
            return jsonify({'appointments':[]})
        rows = db.execute("""
            SELECT a.*, u.name as patient_name, u.phone as patient_phone, u.avatar_url as patient_avatar
            FROM appointments a JOIN users u ON a.patient_id=u.id
            WHERE a.doctor_id=? ORDER BY a.created_at DESC
        """, (doc['id'],)).fetchall()
    else:
        rows = db.execute("""
            SELECT a.*, u.name as doctor_name, u.avatar_url as doctor_avatar,
                   d.specialty, d.fee
            FROM appointments a
            JOIN doctors d ON a.doctor_id=d.id
            JOIN users u ON d.user_id=u.id
            WHERE a.patient_id=? ORDER BY a.created_at DESC
        """, (uid,)).fetchall()

    db.close()
    return jsonify({'appointments': rows_to_list(rows)})

@app.route('/api/appointments/book', methods=['POST'])
@login_required
def api_book_appointment():
    data = request.json or {}
    doctor_id = data.get('doctor_id')
    appt_date = data.get('date')
    slot = data.get('slot')
    reason = data.get('reason','General Consultation')

    if not all([doctor_id, appt_date, slot]):
        return jsonify({'error': 'doctor_id, date and slot are required'}), 400

    db = get_db()
    # Check slot not already taken
    existing = db.execute(
        "SELECT id FROM appointments WHERE doctor_id=? AND appt_date=? AND slot=? AND status NOT IN ('cancelled')",
        (doctor_id, appt_date, slot)
    ).fetchone()
    if existing:
        db.close()
        return jsonify({'error': 'This slot is already booked'}), 409

    doctor = row_to_dict(db.execute("SELECT * FROM doctors WHERE id=?", (doctor_id,)).fetchone())
    if not doctor:
        db.close()
        return jsonify({'error': 'Doctor not found'}), 404

    call_room = 'room-' + uuid.uuid4().hex[:8]
    db.execute("""
        INSERT INTO appointments (patient_id,doctor_id,appt_date,slot,status,payment_status,reason,call_room)
        VALUES (?,?,?,?,'pending_payment','pending',?,?)
    """, (session['user_id'], doctor_id, appt_date, slot, reason, call_room))
    appt_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]
    db.commit()
    db.close()

    return jsonify({
        'message': 'Appointment created. Proceed to payment.',
        'appointment_id': appt_id,
        'amount': doctor['fee'],
        'call_room': call_room
    }), 201

@app.route('/api/appointments/<int:appt_id>', methods=['GET'])
@login_required
def api_get_appointment(appt_id):
    db = get_db()
    row = db.execute("""
        SELECT a.*, u.name as doctor_name, u.avatar_url as doctor_avatar,
               d.specialty, d.fee, d.hospital
        FROM appointments a
        JOIN doctors d ON a.doctor_id=d.id
        JOIN users u ON d.user_id=u.id
        WHERE a.id=? AND a.patient_id=?
    """, (appt_id, session['user_id'])).fetchone()
    db.close()
    if not row:
        return jsonify({'error':'Appointment not found'}), 404
    return jsonify({'appointment': row_to_dict(row)})

@app.route('/api/appointments/<int:appt_id>/status', methods=['PUT'])
@login_required
def api_update_appt_status(appt_id):
    data = request.json or {}
    new_status = data.get('status')
    if not new_status:
        return jsonify({'error': 'status required'}), 400
    db = get_db()
    db.execute("UPDATE appointments SET status=? WHERE id=?", (new_status, appt_id))
    db.commit()
    db.close()
    return jsonify({'message': 'Status updated'})

# ─────────────────────────────────────────────
# PAYMENTS API
# ─────────────────────────────────────────────
@app.route('/api/payments/initiate', methods=['POST'])
@login_required
def api_payment_initiate():
    data = request.json or {}
    appt_id = data.get('appointment_id')
    db = get_db()
    appt = row_to_dict(db.execute(
        "SELECT a.*, d.fee FROM appointments a JOIN doctors d ON a.doctor_id=d.id WHERE a.id=? AND a.patient_id=?",
        (appt_id, session['user_id'])
    ).fetchone())
    db.close()
    if not appt:
        return jsonify({'error':'Appointment not found'}), 404
    if appt['payment_status'] == 'paid':
        return jsonify({'error':'Already paid'}), 400

    txn_id = gen_txn()
    return jsonify({
        'txn_id': txn_id,
        'amount': appt['fee'],
        'appointment_id': appt_id,
        'upi_id': 'clinicos@ybl',
        'upi_name': 'ClinicOS Healthcare Pvt Ltd',
        'qr_data': f'upi://pay?pa=clinicos@ybl&pn=ClinicOS+Healthcare&am={appt["fee"]}&tn=Appointment+#{appt_id}&tr={txn_id}'
    })

@app.route('/api/payments/confirm', methods=['POST'])
@login_required
def api_payment_confirm():
    data = request.json or {}
    appt_id = data.get('appointment_id')
    txn_id = data.get('txn_id', gen_txn())
    method = data.get('method', 'UPI')
    amount = data.get('amount', 0)

    db = get_db()
    # Record payment
    db.execute("""
        INSERT INTO payments (appointment_id,patient_id,amount,method,txn_id,status)
        VALUES (?,?,?,?,?,'success')
    """, (appt_id, session['user_id'], amount, method, txn_id))
    pay_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]

    # Update appointment
    db.execute("""
        UPDATE appointments SET payment_status='paid', status='confirmed', payment_id=? WHERE id=?
    """, (pay_id, appt_id))
    db.commit()
    db.close()
    return jsonify({'message': 'Payment confirmed!', 'txn_id': txn_id, 'payment_id': pay_id})

# ─────────────────────────────────────────────
# MEDICINES API
# ─────────────────────────────────────────────
@app.route('/api/medicines')
def api_medicines():
    category = request.args.get('category','')
    q = request.args.get('q','')
    db = get_db()
    if category:
        rows = db.execute("SELECT * FROM medicines WHERE LOWER(category)=LOWER(?)", (category,)).fetchall()
    elif q:
        rows = db.execute("SELECT * FROM medicines WHERE name LIKE ? OR generic_name LIKE ?",
                          (f'%{q}%', f'%{q}%')).fetchall()
    else:
        rows = db.execute("SELECT * FROM medicines").fetchall()
    db.close()
    return jsonify({'medicines': rows_to_list(rows)})

@app.route('/api/medicines/<int:med_id>')
def api_medicine_detail(med_id):
    db = get_db()
    row = db.execute("SELECT * FROM medicines WHERE id=?", (med_id,)).fetchone()
    db.close()
    if not row:
        return jsonify({'error':'Not found'}), 404
    return jsonify({'medicine': row_to_dict(row)})

@app.route('/api/medicine-categories')
def api_med_categories():
    db = get_db()
    rows = db.execute("SELECT DISTINCT category FROM medicines ORDER BY category").fetchall()
    db.close()
    return jsonify({'categories': [r['category'] for r in rows]})

# ─────────────────────────────────────────────
# ORDERS API
# ─────────────────────────────────────────────
@app.route('/api/orders', methods=['GET'])
@login_required
def api_get_orders():
    db = get_db()
    rows = db.execute(
        "SELECT * FROM orders WHERE patient_id=? ORDER BY created_at DESC",
        (session['user_id'],)
    ).fetchall()
    db.close()
    result = []
    for r in rows:
        d = dict(r)
        d['items'] = json.loads(d['items_json'])
        result.append(d)
    return jsonify({'orders': result})

@app.route('/api/orders', methods=['POST'])
@login_required
def api_place_order():
    data = request.json or {}
    items = data.get('items', [])  # [{id, name, price, qty}]
    address = data.get('address','')
    phone = data.get('phone','')

    if not items:
        return jsonify({'error': 'Cart is empty'}), 400
    if not address:
        return jsonify({'error': 'Delivery address required'}), 400

    subtotal = sum(i['price'] * i['qty'] for i in items)
    delivery_fee = 0 if subtotal >= 500 else 49
    total = subtotal + delivery_fee
    txn_id = gen_txn()

    db = get_db()
    db.execute("""
        INSERT INTO orders (patient_id,items_json,subtotal,delivery_fee,total,address,phone,txn_id)
        VALUES (?,?,?,?,?,?,?,?)
    """, (session['user_id'], json.dumps(items), subtotal, delivery_fee, total, address, phone, txn_id))
    order_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]
    db.commit()
    db.close()
    return jsonify({
        'message': 'Order placed successfully!',
        'order_id': order_id,
        'txn_id': txn_id,
        'total': total,
        'delivery_fee': delivery_fee,
        'estimated_delivery': '2-3 business days'
    }), 201

# ─────────────────────────────────────────────
# PRESCRIPTIONS API
# ─────────────────────────────────────────────
@app.route('/api/prescriptions', methods=['GET'])
@login_required
def api_get_prescriptions():
    db = get_db()
    uid = session['user_id']
    role = session.get('role','patient')

    if role == 'doctor':
        doc = row_to_dict(db.execute("SELECT id FROM doctors WHERE user_id=?", (uid,)).fetchone())
        rows = db.execute("""
            SELECT p.*, u.name as patient_name FROM prescriptions p
            JOIN users u ON p.patient_id=u.id
            WHERE p.doctor_id=? ORDER BY p.created_at DESC
        """, (doc['id'],)).fetchall() if doc else []
    else:
        rows = db.execute("""
            SELECT p.*, u.name as doctor_name FROM prescriptions p
            JOIN users u ON (SELECT user_id FROM doctors WHERE id=p.doctor_id)=u.id
            WHERE p.patient_id=? ORDER BY p.created_at DESC
        """, (uid,)).fetchall()
    db.close()
    result = []
    for r in rows:
        d = dict(r)
        d['medicines'] = json.loads(d['medicines_json'])
        result.append(d)
    return jsonify({'prescriptions': result})

@app.route('/api/prescriptions', methods=['POST'])
@login_required
def api_create_prescription():
    if session.get('role') != 'doctor':
        return jsonify({'error':'Unauthorized'}), 403
    data = request.json or {}
    db = get_db()
    uid = session['user_id']
    doc = row_to_dict(db.execute("SELECT id FROM doctors WHERE user_id=?", (uid,)).fetchone())
    if not doc:
        db.close()
        return jsonify({'error':'Doctor profile not found'}), 404

    db.execute("""
        INSERT INTO prescriptions (appointment_id,doctor_id,patient_id,diagnosis,medicines_json,advice,follow_up)
        VALUES (?,?,?,?,?,?,?)
    """, (data.get('appointment_id'), doc['id'], data.get('patient_id'),
          data.get('diagnosis',''), json.dumps(data.get('medicines',[])),
          data.get('advice',''), data.get('follow_up','')))

    # Mark appointment completed
    if data.get('appointment_id'):
        db.execute("UPDATE appointments SET status='completed' WHERE id=?", (data['appointment_id'],))

    db.commit()
    db.close()
    return jsonify({'message': 'Prescription issued successfully!'}), 201

# ─────────────────────────────────────────────
# VACCINATION API
# ─────────────────────────────────────────────
@app.route('/api/newborns', methods=['GET'])
@login_required
def api_get_newborns():
    db = get_db()
    rows = db.execute(
        "SELECT * FROM newborns WHERE parent_id=? ORDER BY created_at DESC",
        (session['user_id'],)
    ).fetchall()
    db.close()
    result = []
    for r in rows:
        d = dict(r)
        d['vaccines'] = json.loads(d['vaccines_json'])
        result.append(d)
    return jsonify({'newborns': result})

@app.route('/api/newborns', methods=['POST'])
@login_required
def api_register_newborn():
    data = request.json or {}
    vaccines = list(DEFAULT_VACCINE_SCHEDULE)
    # Mark birth doses if given
    for v in vaccines:
        if v['ageDue'] == 'At Birth' and data.get('birth_doses_given'):
            v['status'] = 'Completed'
            v['date'] = data.get('dob','')
            v['batchNo'] = 'HOSPITAL-AUTO'

    db = get_db()
    db.execute("""
        INSERT INTO newborns (parent_id,baby_name,dob,gender,birth_weight,blood_group,
            mother_name,father_name,delivery_place,address,phone,vaccines_json)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    """, (session['user_id'], data.get('baby_name',''), data.get('dob',''),
          data.get('gender',''), data.get('birth_weight',''), data.get('blood_group','O+'),
          data.get('mother_name',''), data.get('father_name',''),
          data.get('delivery_place',''), data.get('address',''), data.get('phone',''),
          json.dumps(vaccines)))
    baby_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]
    db.commit()
    db.close()
    return jsonify({'message':'Baby registered!', 'baby_id': baby_id}), 201

@app.route('/api/newborns/<int:baby_id>/vaccine', methods=['PUT'])
@login_required
def api_administer_vaccine(baby_id):
    data = request.json or {}
    vaccine_name = data.get('vaccine_name','')
    batch_no = data.get('batch_no', gen_txn()[:10])

    db = get_db()
    baby = row_to_dict(db.execute("SELECT * FROM newborns WHERE id=?", (baby_id,)).fetchone())
    if not baby:
        db.close()
        return jsonify({'error':'Baby not found'}), 404

    vaccines = json.loads(baby['vaccines_json'])
    for v in vaccines:
        if v['name'] == vaccine_name:
            v['status'] = 'Completed'
            v['date'] = date.today().strftime('%Y-%m-%d')
            v['batchNo'] = batch_no
            break

    db.execute("UPDATE newborns SET vaccines_json=? WHERE id=?", (json.dumps(vaccines), baby_id))
    db.commit()
    db.close()
    return jsonify({'message':'Vaccine recorded!'})

# ─────────────────────────────────────────────
# PROFILE API
# ─────────────────────────────────────────────
@app.route('/api/profile', methods=['PUT'])
@login_required
def api_update_profile():
    data = request.json or {}
    db = get_db()
    db.execute("""
        UPDATE users SET name=?, phone=?, dob=?, address=?, blood_group=? WHERE id=?
    """, (data.get('name'), data.get('phone'), data.get('dob'),
          data.get('address'), data.get('blood_group'), session['user_id']))
    db.commit()
    user = row_to_dict(db.execute("SELECT * FROM users WHERE id=?", (session['user_id'],)).fetchone())
    db.close()
    return jsonify({'message':'Profile updated!', 'user': _safe_user(user)})

# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
if __name__ == '__main__':
    init_db()
    print("\n" + "="*55)
    print("  ClinicOS Backend Server Running!")
    print("  Open: http://localhost:5000")
    print("  Demo Patient: patient@demo.com / Patient@123")
    print("  Demo Doctor:  robert.chen@clinicos.health / Doctor@123")
    print("="*55 + "\n")
    app.run(debug=True, port=5000, host='0.0.0.0')
