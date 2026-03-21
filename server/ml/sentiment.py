from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Initialize VADER
analyzer = SentimentIntensityAnalyzer()

# Comparison-related keywords
UPWARD_KEYWORDS = [
    "jealous", "envy", "wish i had", "not good enough", "inferior",
    "they have", "everyone has", "better than me", "i wish i was",
    "i wish i looked", "inadequate", "left out", "missing out",
    "fomo", "insecure", "ugly", "poor", "unsuccessful", "failure"
]

DOWNWARD_KEYWORDS = [
    "at least i", "better than", "grateful", "thankful", "lucky",
    "fortunate", "could be worse", "superior", "ahead of"
]

def analyze_sentiment(text: str):
    """Analyze sentiment of a text and return scores and label"""
    if not text:
        return {
            "sentiment_score": 0.0,
            "sentiment_label": "neutral"
        }

    scores = analyzer.polarity_scores(text)
    compound = scores["compound"]

    if compound >= 0.05:
        label = "positive"
    elif compound <= -0.05:
        label = "negative"
    else:
        label = "neutral"

    return {
        "sentiment_score": compound,
        "sentiment_label": label
    }

def detect_comparison(text: str):
    """Detect if text contains comparison language"""
    if not text:
        return {
            "upward_score": 0.0,
            "downward_score": 0.0,
            "neutral_score": 1.0
        }

    text_lower = text.lower()

    upward_count = sum(1 for keyword in UPWARD_KEYWORDS if keyword in text_lower)
    downward_count = sum(1 for keyword in DOWNWARD_KEYWORDS if keyword in text_lower)
    total = upward_count + downward_count

    if total == 0:
        return {
            "upward_score": 0.0,
            "downward_score": 0.0,
            "neutral_score": 1.0
        }

    upward_score = round(upward_count / total, 2)
    downward_score = round(downward_count / total, 2)
    neutral_score = round(1 - upward_score - downward_score, 2)

    return {
        "upward_score": upward_score,
        "downward_score": downward_score,
        "neutral_score": neutral_score
    }

def calculate_comparison_index(mood_score: int, sentiment_score: float, upward_score: float):
    """Calculate overall comparison risk index (0-100)"""
    # Lower mood + negative sentiment + high upward comparison = high risk
    mood_factor = (10 - mood_score) * 5          # 0-50
    sentiment_factor = (1 - sentiment_score) * 25 # 0-50 (flipped so negative = higher)
    upward_factor = upward_score * 20             # 0-20

    index = mood_factor + sentiment_factor + upward_factor

    # Clamp between 0 and 100
    index = max(0, min(100, index))

    return round(index, 2)

def get_risk_level(comparison_index: float):
    """Convert comparison index to risk level"""
    if comparison_index >= 70:
        return "high"
    elif comparison_index >= 40:
        return "moderate"
    else:
        return "low"

def get_recommendations(risk_level: str, upward_score: float, sentiment_label: str):
    """Generate recommendations based on risk level"""
    recommendations = []

    if risk_level == "high":
        recommendations = [
            {"category": "detox", "message": "Consider a 24-hour social media detox to reset your mindset."},
            {"category": "mindfulness", "message": "Try a 10-minute meditation to ground yourself in the present."},
            {"category": "journaling", "message": "Write down 3 things you are grateful for about yourself today."},
            {"category": "break", "message": "Take a break from social media for the rest of the day."}
        ]
    elif risk_level == "moderate":
        recommendations = [
            {"category": "mindfulness", "message": "Take a short 5-minute break and do some deep breathing."},
            {"category": "journaling", "message": "Reflect on one thing you accomplished today, no matter how small."},
            {"category": "break", "message": "Try limiting your social media use to 30 minutes for the rest of the day."}
        ]
    else:
        recommendations = [
            {"category": "positive", "message": "Great job maintaining a healthy digital balance today!"},
            {"category": "mindfulness", "message": "Keep up the good work — your mindful usage is paying off."}
        ]

    return recommendations