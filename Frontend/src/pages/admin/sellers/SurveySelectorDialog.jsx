import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

const surveyors = [
  { id: 'Qasim', name: 'Qasim' },
  { id: 'SherMohammad', name: 'SherMohammad' },
  { id: 'Aqib', name: 'Aqib' },
];

const SurveySelectorDialog = ({ open, seller, onClose, onSchedule }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSurveyor, setSelectedSurveyor] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onSchedule({
      sellerId: seller?._id,
      surveyorId: selectedSurveyor,
      scheduledDate: selectedDate,
      notes,
    });
  };

  if (!seller) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule Warehouse Survey</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Company: {seller.name}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Survey Date & Time"
                value={selectedDate}
                onChange={setSelectedDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Assign Surveyor</InputLabel>
              <Select
                value={selectedSurveyor}
                label="Assign Surveyor"
                onChange={(e) => setSelectedSurveyor(e.target.value)}
              >
                {surveyors.map((surveyor) => (
                  <MenuItem key={surveyor.id} value={surveyor.id}>
                    {surveyor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Notes"
              multiline
              rows={4}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedDate || !selectedSurveyor}
        >
          Schedule Survey
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SurveySelectorDialog;

