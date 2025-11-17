import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFiscalNotes } from "@/hooks/useFiscalNotes";
import { FileText, Download, XCircle, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function FiscalNotesList() {
  const { fiscalNotes, isLoading, cancelNote, isCancellingNote } = useFiscalNotes();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Pendente',
      processing: 'Processando',
      issued: 'Emitida',
      error: 'Erro',
      cancelled: 'Cancelada',
    };
    return texts[status] || status;
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/90 via-purple-950/40 to-gray-900/90 border-purple-500/20">
        <CardContent className="py-8">
          <p className="text-center text-gray-400">Carregando notas fiscais...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/90 via-purple-950/40 to-gray-900/90 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <FileText className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-white">Notas Fiscais Emitidas</CardTitle>
            <CardDescription className="text-gray-400">
              Histórico de notas fiscais eletrônicas
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {fiscalNotes.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Nenhuma nota fiscal emitida ainda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fiscalNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-lg bg-gray-900/50 border border-gray-700/50 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(note.status)}>
                        {getStatusIcon(note.status)}
                        <span className="ml-1">{getStatusText(note.status)}</span>
                      </Badge>
                      {note.note_number && (
                        <span className="text-sm text-gray-400">
                          Nº {note.note_number}
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-400">
                      {note.issued_at && (
                        <p>Emitida em: {formatDate(note.issued_at)}</p>
                      )}
                      {note.error_message && (
                        <p className="text-red-400 mt-1">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          {note.error_message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {note.pdf_url && note.status === 'issued' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                        onClick={() => window.open(note.pdf_url!, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    )}
                    
                    {note.status === 'issued' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => cancelNote(note.id)}
                        disabled={isCancellingNote}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
