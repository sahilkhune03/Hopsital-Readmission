import numpy as np
from flask import Flask, request, render_template
import pickle

app = Flask(__name__)
model = pickle.load(open('model.pkl', 'rb'))

@app.route('/')
def home():
    return render_template('prediction.html')



@app.route('/predict', methods=['POST'])
def predict():
    '''
    For rendering results on HTML GUI
    '''
    int_features = [int(x) for x in request.form.values()]
    final_features = [np.array(int_features)]
    prediction = model.predict(final_features)

    def final_output(x):
        if x == 1:
            return 'Yes'
        else:
            return 'No'

    # Recommendation based on prediction
    if prediction == 1:
        recommendation = "Careful Insulin Titration:Work closely with healthcare providers to titrate insulin doses based on blood glucose levels and overall health stat Avoid self-adjustments of insulin doses without consulting healthcare professionals.Emergency Preparedness:Develop an emergency plan for unexpected situations, including a list of emergency contacts and instructions for managing diabetes during emergencies."
    else:
        recommendation = "  We recommend you to prioritize medication adherence, monitor glucose levels, follow a diabetes-friendly diet, and promote activity for diabetes."

    return render_template('prediction.html', prediction_text=f'Will this patient get readmitted within 30 days of discharge: {final_output(prediction)}', recommendation_text=recommendation)
if __name__ == "__main__":
    app.run(debug=True)

 #We recommend you to prioritize medication adherence, monitor glucose levels, follow a diabetes-friendly diet, promote activity for diabetes.
 



