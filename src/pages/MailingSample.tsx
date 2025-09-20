import { ArrowLeft, Package, MapPin, Clock, Phone, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const mailingSteps = [
  {
    title: "Verify Sample Preparation",
    description: "Ensure your saliva sample is properly labeled and sealed in the protective sleeve",
    icon: <CheckCircle className="h-5 w-5" />
  },
  {
    title: "Use Pre-Paid Shipping Label",
    description: "Attach the provided FedEx overnight shipping label to the envelope",
    icon: <Package className="h-5 w-5" />
  },
  {
    title: "Drop Off at FedEx Location",
    description: "Take to any FedEx drop-off location or schedule a pickup",
    icon: <MapPin className="h-5 w-5" />
  }
];

export default function MailingSample() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Mailing Your Sample</h1>
              <p className="text-xs text-muted-foreground">Ship to ASU Mass Spectrometry</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Shipping Overview */}
        <Card className="bg-gradient-primary text-primary-foreground border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Package className="h-6 w-6" />
              <div>
                <h2 className="font-bold text-base">Ready to Ship</h2>
                <p className="text-xs text-primary-foreground/80">Overnight delivery to ASU lab</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Analysis begins within 24 hours of receipt</span>
            </div>
          </CardContent>
        </Card>

        {/* Destination Lab */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Destination Laboratory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Arizona State University</h4>
                <p className="text-sm text-muted-foreground">Mass Spectrometry Facility</p>
              </div>
              
              <div className="text-sm space-y-1">
                <p><strong>Address:</strong></p>
                <p className="text-muted-foreground">
                  Physical Sciences Building A Wing<br/>
                  Room PSA-220<br/>
                  Arizona State University<br/>
                  Tempe, AZ 85287-1604
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>(480) 965-2591</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>mass.spec@asu.edu</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mailing Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mailingSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {step.icon}
                      <h4 className="font-semibold text-sm">{step.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Shipping Notes */}
        <Card className="bg-warning border-warning/40 shadow-card">
          <CardContent className="p-4">
            <h4 className="font-semibold text-warning-foreground mb-3">Critical Shipping Requirements</h4>
            <div className="space-y-2 text-sm text-warning-foreground">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-warning-foreground mt-2 flex-shrink-0" />
                <span><strong>Ship within 24 hours</strong> of sample collection</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-warning-foreground mt-2 flex-shrink-0" />
                <span><strong>Room temperature only</strong> - do not refrigerate or freeze</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-warning-foreground mt-2 flex-shrink-0" />
                <span><strong>Use overnight shipping</strong> - included in your kit</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-warning-foreground mt-2 flex-shrink-0" />
                <span><strong>Track your shipment</strong> using the provided tracking number</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Information */}
        <Card>
          <CardHeader>
            <CardTitle>After Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Once you ship your sample, you'll receive:
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>FedEx tracking confirmation email</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Lab receipt notification (within 24 hours)</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Analysis progress updates in your dashboard</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Results notification (2-3 business days)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full"
            onClick={() => navigate('/sample-prep')}
          >
            Review Sample Preparation
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}