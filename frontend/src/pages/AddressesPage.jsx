import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import apiClient from '../api/apiClient';

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Dialog state (for both Add and Edit)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null = Add, object = Edit
  const [addressInput, setAddressInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/customers/addresses');
      if (res.data && res.data.addresses) {
        setAddresses(res.data.addresses);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setErrorMessage('Failed to load saved addresses.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setAddressInput('');
    setDialogOpen(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingAddress(addr);
    setAddressInput(addr.address);
    setDialogOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!addressInput.trim()) return;

    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (editingAddress) {
        // UPDATE (PUT /api/customers/addresses/:id)
        const res = await apiClient.put(`/customers/addresses/${editingAddress.addressId}`, {
          address: addressInput.trim(),
        });
        if (res.data && res.data.success) {
          setSuccessMessage('Address updated successfully.');
          setDialogOpen(false);
          fetchAddresses();
        }
      } else {
        // CREATE (POST /api/customers/addresses)
        const res = await apiClient.post('/customers/addresses', {
          address: addressInput.trim(),
        });
        if (res.data && res.data.success) {
          setSuccessMessage('Address added successfully.');
          setDialogOpen(false);
          fetchAddresses();
        }
      }
    } catch (err) {
      console.error('Save address error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to save address.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (id) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    setDeleting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // DELETE (DELETE /api/customers/addresses/:id)
      const res = await apiClient.delete(`/customers/addresses/${deletingId}`);
      if (res.data && res.data.success) {
        setSuccessMessage('Address deleted successfully.');
        setDeleteDialogOpen(false);
        fetchAddresses();
      }
    } catch (err) {
      console.error('Delete address error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to delete address.');
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.02em', mb: 0.5 }}>
            My Saved Addresses
          </Typography>
          <Typography variant="body2" sx={{ color: '#72655F' }}>
            Manage the residential and commercial locations where pest control services are executed.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleOpenAdd}
          startIcon={<AddLocationIcon />}
          sx={{
            backgroundColor: '#8C7366',
            color: '#F4EFEA',
            fontWeight: 750,
            borderRadius: 9999,
            px: 3,
            py: 1.1,
            boxShadow: '0 4px 14px rgba(140, 115, 102, 0.25)',
            '&:hover': { backgroundColor: '#735b4f' },
          }}
        >
          Add New Address
        </Button>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress sx={{ color: '#8C7366' }} />
        </Box>
      ) : addresses.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: '#FAF8F5',
            border: '2px dashed rgba(176, 148, 133, 0.4)',
            borderRadius: 4.5,
          }}
        >
          <HomeIcon sx={{ fontSize: 56, color: '#B09485', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2B2523', mb: 1 }}>
            No Addresses Registered
          </Typography>
          <Typography variant="body2" sx={{ color: '#72655F', mb: 3 }}>
            You haven't saved any property addresses yet. Add one now to make service booking seamless.
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenAdd}
            sx={{
              backgroundColor: '#8C7366',
              color: '#F4EFEA',
              fontWeight: 750,
              borderRadius: 9999,
              px: 3.5,
              py: 1.2,
              '&:hover': { backgroundColor: '#735b4f' },
            }}
          >
            Add Your First Address
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {addresses.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.addressId}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 4,
                  border: '1px solid rgba(176, 148, 133, 0.22)',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(43, 37, 35, 0.03)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 28px rgba(43, 37, 35, 0.06)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.8 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        backgroundColor: '#F4EFEA',
                        color: '#8C7366',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <HomeIcon fontSize="small" />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2B2523' }}>
                      Address #{index + 1}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#72655F', lineHeight: 1.65 }}>
                    {item.address}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', px: 2.5, pb: 2.5, pt: 0, gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenEdit(item)}
                    sx={{ textTransform: 'none', color: '#8C7366', fontWeight: 700, borderRadius: 9999 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleOpenDelete(item.addressId)}
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 9999 }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, color: '#2B2523', letterSpacing: '-0.01em' }}>
          {editingAddress ? 'Edit Address' : 'Add New Service Address'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#72655F', mb: 2 }}>
            Provide complete location details including house/office number, society/building, street, and landmark.
          </Typography>
          <TextField
            autoFocus
            required
            fullWidth
            multiline
            rows={3}
            label="Service Address"
            placeholder="Enter complete building/flat number, street, area, city, and pincode"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#72655F' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !addressInput.trim()}
            sx={{
              backgroundColor: '#8C7366',
              color: '#F4EFEA',
              fontWeight: 750,
              borderRadius: 9999,
              px: 3,
              '&:hover': { backgroundColor: '#735b4f' },
            }}
          >
            {saving ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800, color: '#2B2523' }}>Delete Address?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#72655F' }}>
            Are you sure you want to delete this address from your profile? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#72655F' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleting} sx={{ fontWeight: 700, borderRadius: 9999 }}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddressesPage;
