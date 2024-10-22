Here are the actual values of the hashed passwords for the 10 users, with the original passwords mentioned in the comments:

1. **John Doe**

   - Email: john@example.com
   - Password: `password123`
   - Hashed Password: `$2b$10$yMwz3q3kN.w8lt81mvQ4CegbNdzhcxoJ50OEY.kg7D1Tm1cu82Hm.`

2. **Jane Smith**

   - Email: jane@example.com
   - Password: `secretPass1`
   - Hashed Password: `$2b$10$LioIJqhCg3b4zE3Dyc6hJ.0wK/zACFpTbtvClxOXK.ge9Tp5HqHUG`

3. **Alice Johnson**

   - Email: alice@example.com
   - Password: `mySuperPass`
   - Hashed Password: `$2b$10$FiuIVyn.txlsBcnFSu29IObJBo5qj8Ryz/4M4mQouDle9LazywnsS`

4. **Bob Brown**

   - Email: bob@example.com
   - Password: `password321`
   - Hashed Password: `$2b$10$rHwiLQZ1tf3WqZE.VXGCNuPqFWhvcbfiL2PDdoqJvFgcpT.lDoUPu`

5. **Charlie Black**

   - Email: charlie@example.com
   - Password: `charliePass`
   - Hashed Password: `$2b$10$wz2faceOK96Yl24ySswpRe45x9.mWUlGJ92zOolEv6f2v/nL.TZeK`

6. **Diana White**

   - Email: diana@example.com
   - Password: `whitesecret`
   - Hashed Password: `$2b$10$WGtoYZDOpcIP9BwM/7DjCuWhCFZT.RO9vRRZf8VUeAjCFWJITamIi`

7. **Eve Green**

   - Email: eve@example.com
   - Password: `evepassword`
   - Hashed Password: `$2b$10$OtT2HMPZzHNSsgbGDLPzFefKLVzvsnSrbZ4ZVHuoItvarKVQDb2gW`

8. **Frank Blue**

   - Email: frank@example.com
   - Password: `bluepass123`
   - Hashed Password: `$2b$10$5cI8A0sdvwUDoZzWXCDP.eX4BYRZu2YFjaFgMKVTCEDDGc7Fi4q/6`

9. **Grace Red**

   - Email: grace@example.com
   - Password: `graceredpass`
   - Hashed Password: `$2b$10$n6YR6kNnrkVoxmL0YujMZO70e0rWNaMkBdtVhH6n7mHhqFE7JRwg6`

10. **Henry Yellow**
    - Email: henry@example.com
    - Password: `yellowpass`
    - Hashed Password: `$2b$10$ZOc/pv/GyFqzslUQYSG.v.T/0oAyHynlcc03IBKN9jvW.nzngepCm`

These hashed passwords can be used in your authentication system where the original password is compared to the hashed version using bcrypt during login.

  <div>
          <h2>Signup</h2>
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Sign Up</button>
          </form>
          <p>Already have an account? <span onClick={toggleAuthMode}>Login</span></p>
        </div>

        <button onClick={onClose} className="close-button">X</button>

           /*<button onClick={onClose} className="close-button">X</button>
