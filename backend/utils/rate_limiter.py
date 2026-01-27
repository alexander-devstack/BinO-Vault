from datetime import datetime, timedelta
from flask import request

class RateLimiter:
    def __init__(self):
        self.attempts = {}  # {ip: [timestamp1, timestamp2, ...]}
        self.max_attempts = 5
        self.window_minutes = 15
    
    def clean_old_attempts(self, ip):
        """Remove attempts older than window"""
        if ip not in self.attempts:
            return
        cutoff = datetime.now() - timedelta(minutes=self.window_minutes)
        self.attempts[ip] = [ts for ts in self.attempts[ip] if ts > cutoff]
        if not self.attempts[ip]:
            del self.attempts[ip]
    
    def is_rate_limited(self, ip):
        """Check if IP is rate limited"""
        self.clean_old_attempts(ip)
        if ip not in self.attempts:
            return False, 0
        
        if len(self.attempts[ip]) >= self.max_attempts:
            oldest = min(self.attempts[ip])
            wait_until = oldest + timedelta(minutes=self.window_minutes)
            seconds_remaining = int((wait_until - datetime.now()).total_seconds())
            return True, max(0, seconds_remaining)
        return False, 0
    
    def add_attempt(self, ip):
        """Record failed login attempt"""
        if ip not in self.attempts:
            self.attempts[ip] = []
        self.attempts[ip].append(datetime.now())
    
    def reset_attempts(self, ip):
        """Clear attempts on successful login"""
        if ip in self.attempts:
            del self.attempts[ip]

rate_limiter = RateLimiter()
